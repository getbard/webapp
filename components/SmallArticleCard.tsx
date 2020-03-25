import styled from '@emotion/styled';
import Link from 'next/link';
import { formatDistanceStrict } from 'date-fns';

import { Article } from '../generated/graphql';

const ArticleCardDiv = styled.div`
  &:hover {
    h1 {
      color: #616161;
    }
  }
`;

function SmallArticleCard({ article }: { article: Article }): React.ReactElement {
  const articleHref = article?.slug ? `/articles/s/${article.slug}` : `/articles/i/${article.id}`;
  const authorName = `${article.author.firstName}${article.author?.lastName && ' ' + article.author.lastName[0] + '.'}`;

  return (
    <Link href={articleHref}>
      <ArticleCardDiv className="py-4 px-2 mx-2 rounded-sm hover:cursor-pointer transition duration-150 ease-in">
        <h1 className="font-serif font-bold transition duration-150 ease-in">{article.title}</h1>
        {article.summary && <div className="text-gray-600 mt-1 text-sm">{article.summary}</div>}
        
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
      </ArticleCardDiv>
    </Link>
  );
}

export default SmallArticleCard;
