import { useQuery } from '@apollo/react-hooks';
import { XMasonry, XBlock } from 'react-xmasonry';
import styled from '@emotion/styled';

import useMedia from '../hooks/useMedia';

import { Article } from '../generated/graphql';
import DiscoverArticlesQuery from '../queries/DiscoverArticlesQuery';

import ArticleCard from './ArticleCard';
import SmallArticleCard from './SmallArticleCard';

function shuffle(arr: any[]): any[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ArticleChunkContainer = styled.div`
  > div:not(:last-child) {
    border-bottom: 1px solid;
    border-color: #e0e0e0;
  }
`;

function DiscoverArticles(): React.ReactElement {
  const smallArticleCardWidth = useMedia(['(max-width: 640px)', '@media (min-width: 640px)'], [1, 2], 2);
  const smallArticleCardCount = useMedia(['(max-width: 640px)', '@media (min-width: 640px)'], [4, 8], 8);
  const { loading, error, data } = useQuery(DiscoverArticlesQuery);

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading</div>;

  const { articles } = data;
  const articleChunks: Article[][] = [];
  const articlesWithoutHeader: Article[] = [];
  const articlesWithHeader: Article[] = [];

  articles.forEach((article: Article) => {
    if (article.headerImageURL) {
      articlesWithHeader.push(article);
    } else {
      articlesWithoutHeader.push(article);
    }
  });

  for (let i = 0; i < articlesWithoutHeader.length; i+= smallArticleCardCount) {
    articleChunks.push(articlesWithoutHeader.slice(i, i + smallArticleCardCount));
  }

  const articleBlocks = articlesWithHeader.map((article: Article) => {
    return (
      <XBlock key={article.id}>
        <ArticleCard article={article} />
      </XBlock>
    );
  });

  const articleChunkBlocks = articleChunks.map((articleChunk: Article[], index: number) => {
    return (
      <XBlock key={index} width={smallArticleCardWidth}>
        <div className="grid sm:grid-cols-2 border border-gray-300 m-2 p-1">
          <ArticleChunkContainer className="sm:hidden">
            {articleChunk.map((article: Article) => {
              return (
                <SmallArticleCard key={article.id} article={article} />
              );
            })}
          </ArticleChunkContainer>
          <ArticleChunkContainer className="col-span-1 border-r border-gray-300 hidden sm:block">
            {articleChunk.slice(0, articleChunk.length / 2).map((article: Article) => {
              return (
                <SmallArticleCard key={article.id} article={article} />
              );
            })}
          </ArticleChunkContainer>
          <ArticleChunkContainer className="col-span-1 hidden sm:block">
            {articleChunk.slice(articleChunk.length / 2).map((article: Article) => {
              return (
                <SmallArticleCard key={article.id} article={article} />
              );
            })}
          </ArticleChunkContainer>
        </div>
      </XBlock>
    )
  });

  const blocks = shuffle([...articleBlocks, ...articleChunkBlocks]);

  return (
    <XMasonry>
      {blocks}
    </XMasonry>
  );
}

export default DiscoverArticles;
