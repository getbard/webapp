import { useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import ProgressiveImage from 'react-progressive-image';
import { NextSeo } from 'next-seo';
import { differenceInSeconds } from 'date-fns';
import { useInView } from 'react-intersection-observer';

import ArticleBySlugQuery, { ArticleBySlugQueryString } from '../../queries/ArticleBySlugQuery';
import ArticleByIdQuery, { ArticleByIdQueryString } from '../../queries/ArticleByIdQuery';

import { useAuth } from '../../hooks/useAuth';

import { timeToRead, timeToReadNumber, serializeText } from '../../lib/editor';
import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import Editor from '../../components/Editor';
import SupportConfirmation from '../../components/SupportConfirmation';
import Comments from '../../components/Comments';
import DateMeta from '../../components/DateMeta';
import ArticleFallback from '../../components/ArticleFallback';
import GenericError from '../../components/GenericError';
import BardError from '../_error';
import AuthorSupport from '../../components/AuthorSupport';
import ArticleHeaderSupport from '../../components/ArticleHeaderSupport';
import ContentBlocker from '../../components/ContentBlocker';
import Button from '../../components/Button';
import ShareArticleButton from '../../components/ShareArticleButton';
import AddToCollection from '../../components/AddToCollection';
import MoreArticles from '../../components/MoreArticles';
import FreeArticles from '../../components/FreeArticles';
import Avatar from '../../components/Avatar';

const ArticleContainer: NextPage = (props: any): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const { id: idParams, sessionId } = router.query;
  const [idType, id] = idParams || [null, null];
  const articleQuery = idType === 's' ? ArticleBySlugQuery : ArticleByIdQuery;
  const [readTracked, setReadTracked] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);
  const [readStarted] = useState(Date.now());
  const [endOfArticleRef, articleBottomInView] = useInView();

  const { loading, error, data, refetch } = useQuery(articleQuery, { variables: { id } });

  if (loading && !props?.article?.id) return <ArticleFallback />;

  if (error?.message.includes('Article not found')) return <BardError statusCode={404} hasGetInitialPropsRun={true} err={null} />;
  if (error) return <div><GenericError title error={error} /></div>;
  const article = data?.article || data?.articleBySlug || props?.article;

  const authorName = `${article.author.firstName}${article.author?.lastName && ' ' + article.author.lastName}`;
  const readingTime = timeToRead(article.wordCount);
  const textContent = serializeText(JSON.parse(article.content)).trim();
  const seoDescription = article?.summary ? article.summary : textContent.substr(0, textContent.lastIndexOf('.', 200));

  const articleTrackingData = {
    articleId: article.id,
    title: article.title,
    slug: article.slug,
    readingTime,
    subscribersOnly: article.subscribersOnly,
    category: article.category,
    headerImage: article.headerImage,
    authorId: article.author.id,
  };

  if (articleBottomInView && !readTracked && !article?.contentBlocked) {
    // Give the user some leeway on how long it
    // should take them to read the given article
    const expectedTime = (timeToReadNumber(article?.wordCount) * 0.25) * 60 || 60;

    // Check if the read is close to the calculated reading
    // time so that reads where people scroll down immediately
    // don't count as a valid read
    const timeToFinish = differenceInSeconds(Date.now(), readStarted);

    if (timeToFinish - expectedTime >= -30) {
      setReadTracked(true);
      window.analytics.track(`ARTICLE: Article read`, articleTrackingData);
    }
  }

  if (typeof window !== 'undefined' && !viewTracked) {
    setViewTracked(true);
    window.analytics.track(`ARTICLE: Article viewed`, articleTrackingData);
  }

  const handleAuthorClick = (): void => {
    window.analytics.track(`ARTICLE: author name clicked`, articleTrackingData);
  }

  const handleEditClick = (): void => {
    window.analytics.track(`ARTICLE: edit article clicked`, articleTrackingData);
    router.push(`/edit/${article.id}`);
  }

  return (
    <>
      <NextSeo
        title={article.title}
        description={seoDescription}
        openGraph={{
          title: article.title,
          type: 'website',
          description: seoDescription,
          url: `https://getbard.com/articles/i/${article.id}`,
          images: [{
            url: `${article.headerImage?.url}&w=960` || 'https://getbard.com/og.png',
            alt: article.title,
          }],
          article: {
            publishedTime: article.publishedAt,
            authors: [authorName],
          },
        }}
        additionalMetaTags={[{
          property: 'twitter:label1',
          content: 'Reading time',
        }, {
          property: 'twitter:data1',
          content: readingTime,
        }]}
      />

      {
        article?.headerImage?.url && (
          <div className="mb-4">
            <ProgressiveImage
              delay={500}
              src={article.headerImage.url}
              placeholder={`${article.headerImage.url}&auto=compress&blur=80`}
            >
              {(src: string): React.ReactElement => <img src={src} className="max-h-screen mx-auto mb-1 mt-5" />}
            </ProgressiveImage>

            {
              article.headerImage?.photographerUrl && (
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
              )
            }
          </div>
        )
      }

      <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
        <div className="mb-8">
        
          <div className="flex justify-between items-center h-8 mb-1">
            <div>
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
            </div>

            {auth.userId && <AddToCollection articleId={article.id} />}
          </div>
          
          <div className="text-4xl w-full font-serif font-bold">
            {article.title}
          </div>

          <div className="text-xl w-full mb-6 font-serif">
            {article?.summary}
          </div>

          <div className="grid grid-cols-2">
            <div className="col-span-1 flex items-center space-x-2">
              {article.author?.avatarUrl && <Avatar user={article.author} readOnly={true} small />}

              <div>
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
            </div>

            <div className="flex justify-end items-center space-x-4">
              <ShareArticleButton article={article} minimal />

              {
                auth.userId === article.author.id
                  ? (
                    <Button onClick={handleEditClick} >
                      Edit this article
                    </Button>
                  )
                  : <ArticleHeaderSupport author={article.author} />
              }
            </div>
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
                <div className="text-center font-bold text-primary p-5 mt-20">
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

        <div ref={endOfArticleRef}></div>

        { 
          auth.userId !== article.author.id && !article?.contentBlocked && (
            <AuthorSupport
              article={article}
              articleTrackingData={articleTrackingData}
            />
          )
        }

        {
          article?.contentBlocked
            ? <FreeArticles author={article.author} />
            : <MoreArticles article={article} author={article.author} />
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

export const getServerSideProps: GetServerSideProps = async context => {
  const idParams = context?.params?.id;
  const [idType, id] = idParams || [null, null];
  const articleQuery = idType === 's' ? ArticleBySlugQueryString : ArticleByIdQueryString;

  // TODO: Don't do this here...
  const userIdCookie = context?.req?.headers?.cookie?.match(/uid=([^;]+)/) || [];
  const tokenCookie = context?.req?.headers?.cookie?.match(/token=([^;]+)/) || [];
  const userId = userIdCookie.length ? userIdCookie[1] : null;
  const token = tokenCookie.length ? tokenCookie[1] : null;

  const res = await fetch(process.env.GRAPHQL_URI!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({
      operationName: 'article',
      query: articleQuery,
      variables: { id },
    }),
  });

  const { data } = await res.json() || {};

  return {
    props: {
      userId,
      article: data?.article || data?.articleBySlug || null,
    },
  };
}

export default withApollo({ ssr: false })(withLayout(ArticleContainer));
