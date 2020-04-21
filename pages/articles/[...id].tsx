import { useRef, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import ProgressiveImage from 'react-progressive-image';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { differenceInSeconds } from 'date-fns';

import ArticleBySlugQuery from '../../queries/ArticleBySlugQuery';
import ArticleByIdQuery from '../../queries/ArticleByIdQuery';

import useOnScreen from '../../hooks/useOnScreen';
import { useAuth } from '../../hooks/useAuth';

import { timeToRead, serializeText } from '../../lib/editor';
import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import Editor from '../../components/Editor';
import HeaderImage from '../../components/HeaderImage';
import SupportConfirmation from '../../components/SupportConfirmation';
import Comments from '../../components/Comments';
import DateMeta from '../../components/DateMeta';
import ArticleFallback from '../../components/ArticleFallback';
import GenericError from '../../components/GenericError';
import BardError from '../_error';
import AuthorSupport from '../../components/AuthorSupport';
import ArticleHeaderSupport from '../../components/ArticleHeaderSupport';
import ContentBlocker from '../../components/ContentBlocker';

const Article: NextPage = (): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const { id: idParams, sessionId, support } = router.query;
  const [idType, id] = idParams;
  const articleQuery = idType === 's' ? ArticleBySlugQuery : ArticleByIdQuery;
  const endOfArticle = useRef(null);
  const articleRead = useOnScreen(endOfArticle);
  const [readTracked, setReadTracked] = useState(false);
  const [readStarted] = useState(Date.now());

  const { loading, error, data, refetch } = useQuery(articleQuery, { variables: { id } });

  if (loading) return <ArticleFallback />;

  if (error?.message.includes('Article not found')) return <BardError statusCode={404} hasGetInitialPropsRun={true} err={null} />;
  if (error) return <div><GenericError title /></div>;

  const article = data?.article || data?.articleBySlug;
  const authorName = `${article.author.firstName}${article.author?.lastName && ' ' + article.author.lastName}`;
  const readingTime = timeToRead(article.wordCount);
  const textContent = serializeText(JSON.parse(article.content)).trim();
  const seoDescription = article?.summary
    ? article.summary.substr(0, article.summary.lastIndexOf('.', 180))
    : textContent.substr(0, textContent.lastIndexOf('.', 180));

  const articleTrackingData = {
    article: {
      id: article.id,
      title: article.title,
      slug: article.slug,
      readingTime,
      subscribersOnly: article.subscribersOnly,
      category: article.category,
      headerImage: article.headerImage,
    },
    author: {
      id: article.author.id,
    }
  };

  if (articleRead && !readTracked && !article.contentBlocked) {
    // Give the user some leeway on how long it
    // should take them to read the given article
    const expectedTime = (parseInt(readingTime[0]) * 0.25 || 1) * 60;

    // Check if the read is close to the calculated reading
    // time so that reads where people scroll down immediately
    // don't count as a valid read
    const timeToFinish = differenceInSeconds(Date.now(), readStarted);

    if (timeToFinish - expectedTime >= 0) {
      setReadTracked(true);
      window.analytics.track(`ARTICLE: Article read`, articleTrackingData);
    }
  }

  if (typeof window !== 'undefined') {
    window.analytics.track(`ARTICLE: Article viewed`, articleTrackingData);
  }

  const handleAuthorClick = (): void => {
    window.analytics.track(`ARTICLE: author name clicked`, articleTrackingData);
  }

  return (
    <>
      <NextSeo
        title={article.title}
        description={seoDescription}
        openGraph={{
          title: article.title,
          description: seoDescription,
          images: [{
            url: `${article.headerImage?.url}&w=960` || 'https://getbard.com/og.png',
            alt: article.title,
          }],
          article: {
            publishedTime: article.publishedAt,
            authors: [authorName],
          }
        }}
      />

      <Head>
        {/* {/*
          // @ts-ignore */}
        <meta name="twitter:label1" value="Reading time" />

        {/*
          // @ts-ignore */}
        <meta name="twitter:data1" value={readingTime} />
      </Head>

      <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
        <div className="mb-8">
          {
            article?.headerImage?.url && (
              <div className="mb-4">
                <ProgressiveImage
                  delay={500}
                  src={article.headerImage.url}
                  placeholder={`${article.headerImage.url}&w=400&blur=80`}
                >
                  {(src: string): React.ReactElement => <HeaderImage className="w-auto -mx-5 sm:-mx-40 mb-1" url={src} />}
                </ProgressiveImage>

                <div className="text-xs text-center">
                  Photo by&nbsp;
                  <a
                    className="underline"
                    href={`${article.headerImage.photographerUrl}?utm_source=bard&utm_medium=referral`}
                    onClick={(): void => window.analytics.track(`ARTICLE: Unsplash photographer URL clicked`, articleTrackingData)}
                  >
                    {article.headerImage.photographerName}
                  </a>
                  &nbsp;on&nbsp;
                  <a
                    className="underline"
                    href="https://unsplash.com?utm_source=bard&utm_medium=referral"
                    onClick={(): void => window.analytics.track(`ARTICLE: Unsplash URL clicked`, articleTrackingData)}
                  >
                    Unsplash
                  </a>
                </div>
              </div>
            )
          }
          
          {
            article?.category && (
              <Link href={`/?category=${article.category}`}>
                <a
                  className="capitalize text-lg text-gray-500 w-full font-serif font-bold"
                  onClick={(): void => window.analytics.track(`ARTICLE: Category clicked`, articleTrackingData)}
                >
                  {article.category}
                </a>
              </Link>
            )
          }
          
          <div className="text-4xl w-full font-serif font-bold">
            {article.title}
          </div>

          <div className="text-xl w-full mb-6 font-serif">
            {article?.summary}
          </div>

          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <div className="text-sm font-bold">
                By&nbsp;
                <Link href={`/${article.author.username}`} >
                  <a
                    className="underline"
                    onClick={handleAuthorClick}
                  >
                    {authorName}
                  </a>
                </Link>
              </div>


              <div className="text-xs w-full relative">
                <DateMeta resource={article} dateParam="publishedAt" action="" /> | {readingTime}
              </div>
            </div>

            {
              auth.userId !== article.author.id && (
                <ArticleHeaderSupport
                  author={article.author}
                />
              )
            }
          </div>
        </div>

        <div className="relative">
          <Editor
            readOnly
            initialValue={JSON.parse(article.content)}
          />

          {
            article?.subscribersOnly && article?.contentBlocked && (
              <>
                <div className="text-center font-bold mt-2 text-primary mt-5 p-5">
                  <div>
                    Oh! You edited our HTML. We trimmed the content on the server but nice try!
                  </div>

                  <div>
                    Please consider supporting&nbsp;
                    <Link href={`/${article.author.username}`} >
                      <a
                        className="underline"
                        onClick={(): void => window.analytics.track(`ARTICLE: Consider supporting author clicked`, articleTrackingData)}
                      >
                        {article.author.firstName}
                      </a>
                    </Link>.
                  </div>
                </div>

                <ContentBlocker author={article.author} />
              </>
            )
          }
        </div>

        <div ref={endOfArticle}></div>

        { 
          auth.userId !== article.author.id && (
            <AuthorSupport
              author={article.author}
              articleTrackingData={articleTrackingData}
            />
          )
        }
      
        {!article?.contentBlocked && <Comments resourceId={article.id} />}

        {sessionId && article.author?.stripeUserId && (
          <SupportConfirmation
            authorId={article.author.id}
            sessionId={sessionId}
            stripeUserId={article.author.stripeUserId}
            refetch={refetch}
          />
        )}
      </div>
    </>
  );
}

export default withApollo({ ssr: true })(withLayout(Article));
