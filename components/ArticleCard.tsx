import styled from '@emotion/styled';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiFeather } from 'react-icons/fi';
import ProgressiveImage from 'react-progressive-image';

import { Article } from '../generated/graphql';

import { timeToRead } from '../lib/editor';

const ArticleCardContainer = styled.a`
  &:hover {
    border-color: #bdbdbd;

    h1 {
      color: #616161;
    }

    .sub-only {
      display: flex;
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

  const handleClick = (): void => {
    window.analytics.track(`ARTICLE CARD: ${article.id} clicked`, {
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
        firstName: article.author.firstName,
        lastName: article.author.lastName,
      },
    });
  }
  
  return (
    <Link href="/articles/[...id]" as={articleHref} passHref={true}>
      <ArticleCardContainer
        className="p-4 border border-gray-300 rounded-sm hover:cursor-pointer transition duration-150 ease-in flex justify-between flex-col"
        onClick={handleClick}
      >
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
                    <span className="sub-only bg-white rounded-tr-sm pl-1 pt-1 pr-2 hidden items-center text-xs text-primary font-sans">
                      <FiFeather className="mr-1" /> Supporters Only
                    </span>
                  )
                }
              </ArticleCardImage>
            }
          </ProgressiveImage>
        }
      
        <div>
          <h1 className="font-serif font-bold text-xl transition duration-150 ease-in">
            {
              article.title.length > 45
                ? `${article.title.substr(0, article.title.lastIndexOf(' ', 45))}...`
                : article.title
            }
          </h1>

          <div className="text-gray-600 text-sm">
          {
            article.summary && article.summary.length > 100
              ? `${article.summary.substr(0, article.summary.lastIndexOf(' ', 100))}...`
              : article.summary
          }
          </div>
          
          <div className="text-xs mt-2 font-medium flex justify-between">
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

              <span>
                {readingTime}
              </span>
            </div>
          </div>
        </div>
      </ArticleCardContainer>
    </Link>
  );
}

export default ArticleCard;
