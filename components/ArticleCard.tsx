import styled from '@emotion/styled';

import { Article } from '../generated/graphql';

const ArticleCardDiv = styled.div`
  &:hover {
    cursor: pointer;
    h1 {
      color: #616161;
    }
  }
`;

function ArticleCard({ data }: { data: Article }): React.ReactElement {
  const imageSrc = data.headerImageURL || undefined;

  return (
    <ArticleCardDiv className="p-3 m-2 border border-gray-300 rounded-sm">
      {
        imageSrc
         ? <img className="mb-5" src ={imageSrc} />
         : null
      }

      <h1 className="font-serif font-bold">{data.title}</h1>
      <div className="text-gray-600 text-sm">{data.subtitle}</div>
    </ArticleCardDiv>
  );
}

export default ArticleCard;
