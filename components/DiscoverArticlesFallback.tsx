import styled from '@emotion/styled';

import ArticleCardFallback from './ArticleCardFallback';
import SmallArticleCardFallback from './SmallArticleCardFallback';

const ArticleChunkContainer = styled.div`
  > div:not(:first-of-type) {
    padding-top: 1rem;
  }

  > div:not(:last-child) {
    border-bottom: 1px solid;
    border-color: #f5f5f5;
  }
`;

function DiscoverArticles(): React.ReactElement {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
      <ArticleCardFallback />
      <ArticleCardFallback />
      <ArticleCardFallback />

      <ArticleChunkContainer className="row-span-2 col-span-1 border border-gray-200 p-2">
        <SmallArticleCardFallback />
        <SmallArticleCardFallback />
        <SmallArticleCardFallback />
        <SmallArticleCardFallback />
        <SmallArticleCardFallback />
        <SmallArticleCardFallback />
      </ArticleChunkContainer>

      <ArticleCardFallback />
      <ArticleCardFallback />
      <ArticleCardFallback />
    </div>
  );
}

export default DiscoverArticles;
