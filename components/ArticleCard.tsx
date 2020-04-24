import styled from '@emotion/styled';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiFeather } from 'react-icons/fi';
import ProgressiveImage from 'react-progressive-image';

import { Article } from '../generated/graphql';

import { timeToRead } from '../lib/editor';

const ArticleCardContainer = styled.div`
  &:hover {
    border-color: #bdbdbd;

    .reading-time {
      color: #004346;
    }
  }
`;

type ArticleCardImageProps = {
  url: string;
}

const ArticleCardImage = styled.div`
  background-size: cover;
  background-position: center;
  background-image: url(${(props: ArticleCardImageProps): string => props.url});
`;

function ArticleCard({ article }: { article: Article }): React.ReactElement {
  const articleHref = article?.slug ? `/articles/s/${article.slug}` : `/articles/i/${article.id}`;
  const authorName = `${article.author.firstName}${article.author?.lastName && ' ' + article.author.lastName[0] + '.'}`;
  const readingTime = timeToRead(article.wordCount);

  const articleTitle = article.title.length > 45
    ? `${article.title.substr(0, article.title.lastIndexOf(' ', 45))}...`
    : article.title;

  const articleSummary = article.summary && article.summary.length > 75
    ? `${article.summary.substr(0, article.summary.lastIndexOf(' ', 75))}...`
    : article.summary

  const trackingData = {
    article: {
      id: article.id,
      title: article.title,
      slug: article.slug,
      readingTime,
      subscribersOnly: article.subscribersOnly,
      category: article.category,
    },
    author: {
      id: article.author.id,
    },
  };

  const handleClick = (): void => {
    window.analytics.track(`ARTICLE CARD: clicked`, trackingData);
  }

  const handleAuthorClick = (): void => {
    window.analytics.track(`ARTICLE CARD: author name clicked`, trackingData);
  }

  return (
    <ArticleCardContainer
      className="p-4 border border-gray-300 rounded-sm transition duration-150 ease-in flex justify-between flex-col"
      onClick={handleClick}
    >
      <Link href="/articles/[...id]" as={articleHref} passHref={true}>
        <a className="hover:cursor-pointer">
          {
            article?.headerImage?.url &&
            <ProgressiveImage
              delay={500}
              src={`${article.headerImage.url}&w=400`}
              placeholder={`${article.headerImage.url}&w=200&q=50&blur=80`}
            >
              {(src: string): React.ReactElement =>
                <ArticleCardImage className="flex-grow flex items-end h-40 rounded-t-sm -mt-3 -mx-3 mb-3" url={src}>
                  {
                    article?.subscribersOnly && (
                      <span className="sub-only bg-white rounded-tr-sm pl-1 pt-1 pr-2 flex items-center text-xs text-primary font-sans">
                        <FiFeather className="mr-1" /> Supporters Only
                      </span>
                    )
                  }
                </ArticleCardImage>
              }
            </ProgressiveImage>
          }

          <div>
            <textarea
              id={`${article.id}-card-title`}
              className="cursor-pointer outline-none font-serif font-bold text-xl transition duration-150 ease-in resize-none w-full overflow-hidden"
              rows={article.title.length > 25 ? 2 : 1}
              value={articleTitle}
              readOnly
            />

            <textarea
              id={`${article.id}-card-summary`}
              className="cursor-pointer outline-none text-gray-600 text-sm resize-none w-full overflow-hidden"
              rows={2}
              value={articleSummary || ''}
              readOnly
            />
          </div>
        </a>
      </Link>

      <div>
        <div className="text-xs mt-2 font-medium flex justify-between">
          <Link href={`/${article.author.username}`} >
            <a
              className="text-gray-700"
              onClick={handleAuthorClick}
            >
              {authorName}
            </a>
          </Link>

          <div>
            {
              article.publishedAt
                ? (
                  <span className="text-gray-700">
                    {format(new Date(article.publishedAt), 'LLL d')} |&nbsp;
                  </span>
                )
                : ''
            }

            <span className="reading-time">
              {readingTime}
            </span>
          </div>
        </div>
      </div>
    </ArticleCardContainer>
  );
}

export default ArticleCard;
