import styled from '@emotion/styled';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

import { Article } from '../generated/graphql';

const ArticleCardDiv = styled.div`
  &:hover {
    border-color: #bdbdbd;

    h1 {
      color: #616161;
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
      <ArticleCardDiv className="p-3 m-2 border border-gray-300 rounded-sm hover:cursor-pointer transition duration-150 ease-in">
        {article?.headerImageURL && <ArticleCardImage className="h-40 -mt-3 -mx-3 mb-5 transition duration-150 ease-in" url={article.headerImageURL} />}

        <h1 className="font-serif font-bold text-xl transition duration-150 ease-in">{article.title}</h1>
        <div className="text-gray-600 text-sm">{article.summary}</div>
        
        <div className={`flex justify-between text-xs align-center font-bold ${article.summary && 'mt-2'}`}>
          <div>
            written by {authorName}
          </div> 
          {
            article.publishedAt
              ? (
                <div className="text-primary">
                  {formatDistanceToNow(new Date(article.publishedAt))} ago
                </div>
              )
              : ''
          }
        </div>
      </ArticleCardDiv>
    </Link>
  );
}

export default ArticleCard;
