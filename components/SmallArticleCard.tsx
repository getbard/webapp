import styled from '@emotion/styled';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiFeather } from 'react-icons/fi';

import { Article } from '../generated/graphql';

import { timeToRead } from '../lib/editor';

const ArticleCardContainer = styled.div`
  &:hover {
    h1 {
      color: #616161;
    }

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

  return (
    <Link href="/articles/[...id]" as={articleHref} passHref={true}>
      <ArticleCardContainer className="pt-1 pb-2 px-2 rounded-sm hover:cursor-pointer transition duration-150 ease-in">
        <div className={`${article.subscribersOnly && 'grid grid-cols-8'}`}>
          <h1 className="col-span-7 font-serif font-bold transition duration-150 ease-in">
            {article.title}
          </h1>

          {
            article.subscribersOnly && (
              <SubOnlyIcon className="sub-only hidden items-center text-primary">
                <FiFeather />
              </SubOnlyIcon>
            )
          }
        </div>
        

        {
          article.summary && (
            <div className="text-gray-600 mt-1 text-sm">
              {article.summary}
            </div>
          )
        }
        
        <div className="text-xs mt-2  font-medium flex justify-between">
            <div className="text-gray-700">
              {authorName}
            </div> 

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
                {timeToRead(article.wordCount)}
              </span>
            </div>
          </div>
      </ArticleCardContainer>
    </Link>
  );
}

export default SmallArticleCard;
