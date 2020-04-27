import styled from '@emotion/styled';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiFeather } from 'react-icons/fi';

import { Article } from '../generated/graphql';

import { timeToRead } from '../lib/editor';

const ArticleCardContainer = styled.div`
  &:hover {
    .sub-only {
      display: flex;
    }

    .time-to-read {
      color: #004346;
    }
  }
`;

const SubOnlyIcon = styled.div`
  grid-column: none;
`;

function SmallArticleCard({ article }: { article: Article }): React.ReactElement {
  const articleHref = article?.slug ? `/articles/s/${article.slug}` : `/articles/i/${article.id}`;
  const authorName = `${article.author.firstName}${article.author?.lastName && ' ' + article.author.lastName[0] + '.'}`;
  const readingTime = timeToRead(article.wordCount);

  const trackingData = {
    articleId: article.id,
    title: article.title,
    slug: article.slug,
    readingTime,
    subscribersOnly: article.subscribersOnly,
    category: article.category,
    authorId: article.author.id,
  };

  const handleClick = (): void => {
    window.analytics.track(`SMALL ARTICLE CARD: clicked`, trackingData);
  }

  const handleAuthorClick = (): void => {
    window.analytics.track(`SMALL ARTICLE CARD: author name clicked`, trackingData);
  }

  return (
    <ArticleCardContainer
      className="pt-1 pb-2 px-2 rounded-sm transition duration-150 ease-in"
      onClick={handleClick}
    >
      <Link href="/articles/[...id]" as={articleHref} passHref={true}>
        <a>
          <div className={`${article.subscribersOnly && 'grid grid-cols-8'}`}>
            <h1
              className="col-span-7 font-serif font-bold"
              title={article.title}
            >
              {
                article.title.length > 45
                  ? `${article.title.substr(0, article.title.lastIndexOf(' ', 45))}...`
                  : article.title
              }
            </h1>

            {
              article.subscribersOnly && (
                <SubOnlyIcon className="sub-only block md:hidden pt-1 text-primary">
                  <FiFeather />
                </SubOnlyIcon>
              )
            }
          </div>


          {
            article.summary && (
              <div
                className="text-gray-600 mt-1 text-sm"
                title={article.summary || ''}
              >
                {
                  article.summary.length > 100
                    ? `${article.summary.substr(0, article.summary.lastIndexOf(' ', 100))}...`
                    : article.summary
                }
              </div>
            )
          }
        </a>
      </Link>

      <div className="text-xs mt-2  font-medium flex justify-between">
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

          <span className="time-to-read">
            {readingTime}
          </span>
        </div>
      </div>
    </ArticleCardContainer>
  );
}

export default SmallArticleCard;
