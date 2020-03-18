import styled from '@emotion/styled';
import Link from 'next/link';

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

  return (
    <Link href={`/articles/i/${article.id}`}>
      <ArticleCardDiv className="p-3 m-2 border border-gray-300 rounded-sm hover:cursor-pointer">
        {
          imageSrc
          ? <img className="mb-5" src ={imageSrc} />
          : null
        }

        <h1 className="font-serif font-bold text-xl">{article.title}</h1>
        <div className="text-gray-600 text-sm">{article.summary}</div>
      </ArticleCardDiv>
    </Link>
  );
}

export default ArticleCard;
