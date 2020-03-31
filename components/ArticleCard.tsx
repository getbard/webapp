import styled from '@emotion/styled';
import Link from 'next/link';
import { formatDistanceStrict } from 'date-fns';
import { FiFeather } from 'react-icons/fi';

import { Article } from '../generated/graphql';

const ArticleCardDiv = styled.div`
  &:hover {
    border-color: #bdbdbd;

    h1 {
      color: #616161;
    }

    span {
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
  
  return (
    <Link href={articleHref}>
      <ArticleCardDiv className="p-4 border border-gray-300 rounded-sm hover:cursor-pointer transition duration-150 ease-in flex justify-between flex-col">
        {
          article?.headerImageURL &&
          <ArticleCardImage className="flex-grow flex items-end h-40 rounded-t-sm -mt-3 -mx-3 mb-3" url={article.headerImageURL}>
            {
              article?.subscribersOnly && (
                <span className="bg-white rounded-tr-sm pl-1 pt-1 pr-2 hidden items-center text-xs text-primary font-sans">
                  <FiFeather className="mr-1" /> Supporters Only
                </span>
              )
            }
          </ArticleCardImage>
        }
      
        <div>
          <h1 className="font-serif font-bold text-xl transition duration-150 ease-in">
            {article.title}
          </h1>

          <div className="text-gray-600 text-sm">
            {article.summary}
          </div>
          
          <div className="flex justify-between text-xs align-center font-bold mt-2">
            <div className="text-gray-700">
              {authorName}
            </div> 
            {
              article.publishedAt
                ? (
                  <div className="text-primary">
                    {formatDistanceStrict(new Date(), new Date(article.publishedAt))} ago
                  </div>
                )
                : ''
            }
          </div>
        </div>
      </ArticleCardDiv>
    </Link>
  );
}

export default ArticleCard;
