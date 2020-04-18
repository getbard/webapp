import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';
import ProgressiveImage from 'react-progressive-image';
import { NextSeo } from 'next-seo';

import { User } from '../../generated/graphql';
import ArticleBySlugQuery from '../../queries/ArticleBySlugQuery';
import ArticleByIdQuery from '../../queries/ArticleByIdQuery';

import { useAuth } from '../../hooks/useAuth';

import { timeToRead } from '../../lib/editor';
import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import Editor from '../../components/Editor';
import HeaderImage from '../../components/HeaderImage';
import ButtonLink from '../../components/ButtonLink';
import BecomeSupporterButton from '../../components/BecomeSupporterButton';
import SupportConfirmation from '../../components/SupportConfirmation';
import Comments from '../../components/Comments';
import DateMeta from '../../components/DateMeta';
import ArticleFallback from '../../components/ArticleFallback';

const GradientBlocker = styled.div`
  width: 100%;
  background: linear-gradient(0deg, rgba(255,255,255,1) 20%, rgba(255,255,255,0) 100%);
`;

const ContentBlocker = ({ author }: { author: User }): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const buttonText = auth.userId ? `Support ${author.firstName} to read this article` : 'Create an account to read this article';
  const buttonHref = auth.userId ? `/${author.username}?support=true` : '/signup';

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0">
      <GradientBlocker className="h-full w-full" />

      <div className="bg-white flex flex-col justify-center items-center pb-10 pt-0 -mt-16">
        <div className="mb-2">
          {author.firstName} has made this content available to supporters only.
        </div>

        {
          auth.user && author.stripeUserId && author.stripePlan
            ? <BecomeSupporterButton author={author} />
            : (
              <ButtonLink href={buttonHref}>
                {buttonText}
              </ButtonLink>
            )
        }

        {
          !auth.userId && (
            <div className="mt-2">
              Already a supporter? <Link href={`/login?redirect=${router.asPath}`}><a className="underline">Login to read</a></Link>
            </div>
          )
        }
      </div>
    </div>
  );
}

const Article: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const { id: idParams, sessionId } = router.query;
  const [idType, id] = idParams;
  const articleQuery = idType === 's' ? ArticleBySlugQuery : ArticleByIdQuery;

  const { loading, error, data, refetch } = useQuery(articleQuery, { variables: { id } });

  if (error) return <div>Error</div>;
  if (loading) return <ArticleFallback />;

  const article = data?.article || data?.articleBySlug;
  const authorName = `${article.author.firstName}${article.author?.lastName && ' ' + article.author.lastName}`;
  const readingTime = timeToRead(article.wordCount);
  const seoDescription = article?.summary
    ? article.summary
    : article.content.substr(0, article.content.lastIndexOf('.', 120));

  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      <NextSeo
        title={article.title}
        description={seoDescription}
        openGraph={{
          title: article.title,
          description: `${seoDescription}
            ${readingTime}
          `,
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
                Photo by <a className="underline" href={`${article.headerImage.photographerUrl}?utm_source=bard&utm_medium=referral`}>{article.headerImage.photographerName}</a> on <a className="underline" href="https://unsplash.com?utm_source=bard&utm_medium=referral">Unsplash</a>
              </div>
            </div>
          )
        }
        
        {
          article?.category && (
            <Link href={`/?category=${article.category}`}>
              <a className="capitalize text-lg text-gray-500 w-full font-serif font-bold">
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

        <div className="text-sm w-full font-bold">
          By <Link href={`/${article.author.username}`} ><a className="underline">{authorName}</a></Link>
        </div>

        <div className="text-xs w-full relative">
          <DateMeta resource={article} dateParam="publishedAt" action="" /> | {readingTime}
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
                  Please consider supporting <Link href={`/${article.author.username}`} ><a className="underline">{article.author.firstName}</a></Link>.
                </div>
              </div>

              <ContentBlocker author={article.author} />
            </>
          )
        }
      </div>

      {!article?.contentBlocked && <Comments resourceId={article.id} />}

      {sessionId && article.author?.stripeUserId && (
        <SupportConfirmation
          sessionId={sessionId}
          stripeUserId={article.author.stripeUserId}
          refetch={refetch}
        />
      )}
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Article));
