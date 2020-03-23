import styled from '@emotion/styled';
import Link from 'next/link';
import { format } from 'date-fns';

import { Article } from '../generated/graphql';

const ArticleCardDiv = styled.div`
  &:hover {
    h1 {
      color: #616161;
    }
  }
`;

function ArticleCard({ article }: { article: Article }): React.ReactElement {
  const imageSrc = article.headerImageURL || undefined;
  const articleHref = article?.slug ? `/articles/s/${article.slug}` : `/articles/i/${article.id}`;
  const authorName = `${article.author.firstName}${article.author?.lastName && ' ' + article.author.lastName[0] + '.'}`;
  
  return (
    <Link href={articleHref}>
      <ArticleCardDiv className="p-3 m-2 border border-gray-300 rounded-sm hover:cursor-pointer">
        {
          imageSrc
          ? <img className="mb-5" src ={imageSrc} />
          : null
        }

        <h1 className="font-serif font-bold text-xl">{article.title}</h1>
        <div className="text-gray-600 text-sm">{article.summary}</div>
        
        <div className={`flex justify-between text-xs align-center font-bold ${article.summary && 'mt-2'}`}>
          <div>
            written by <span className="text-primary">{authorName}</span>
          </div> 
          {
            article.publishedAt
              ? <div>{format(new Date(article.publishedAt), 'MMM do')}</div>
              : ''
          }
        </div>
      </ArticleCardDiv>
    </Link>
  );
}

export default ArticleCard;
