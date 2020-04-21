import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';
import Link from 'next/link';

import { Article } from '../generated/graphql';
import DiscoverArticlesQuery from '../queries/DiscoverArticlesQuery';

import DiscoverArticlesFallback from './DiscoverArticlesFallback';
import EmptyState from './EmptyState';
import ArticleCard from './ArticleCard';
import SmallArticleCard from './SmallArticleCard';
import GenericError from './GenericError';

const ArticleChunkContainer = styled.div`
  > div:not(:first-of-type) {
    padding-top: 0.5rem;
  }

  > div:not(:last-child) {
    border-bottom: 1px solid;
    border-color: #e0e0e0;
  }
`;

function DiscoverArticles({
  category,
  setArticles,
}: {
  category: string;
  setArticles: (articles: Article[]) => void;
}): React.ReactElement {
  const { loading, error, data } = useQuery(DiscoverArticlesQuery, { variables: { category } });
  
  if (loading) return <DiscoverArticlesFallback />;
  if (error) return <div><GenericError title /></div>;

  const { articles } = data;
  const articleChunks: Article[][] = [];
  const articlesWithoutHeader: Article[] = [];
  const articlesWithHeader: Article[] = [];

  useEffect(() => {
    setArticles(articles);
  }, [data?.articles.length]);

  articles.forEach((article: Article) => {
    if (article.headerImage?.url) {
      articlesWithHeader.push(article);
    } else {
      articlesWithoutHeader.push(article);
    }
  });

  if (!articlesWithHeader.length) {
    return (
      <EmptyState title="We're at a loss for words...">
        <div>
          We couldn&apos;t find any {category !== 'all' && category} articles.
        </div>

        <div>
          Perhaps you&apos;d like to&nbsp;
          <Link href="/write">
            <a
              className="underline"
              onClick={(): void => window.analytics.track(`DISCOVER: Perhaps you'd like to write one? clicked`)}
            >
              write one?
            </a>
          </Link>
        </div>
      </EmptyState>
    );
  }

  for (let i = 0; i < articlesWithoutHeader.length; i+= 6) {
    articleChunks.push(articlesWithoutHeader.slice(i, i + 6));
  }

  const articleBlocks = articlesWithHeader.map((article: Article) => {
    return <ArticleCard key={article.id} article={article} />;
  });

  const articleChunkBlocks = articleChunks.map((articleChunk: Article[], index: number) => {
    return (
        <ArticleChunkContainer className="row-span-2 col-span-1 border border-gray-300 p-2" key={index}>
          {articleChunk.map((article: Article) => {
            return (
              <SmallArticleCard key={article.id} article={article} />
            );
          })}
        </ArticleChunkContainer>
    )
  });

  const blocks = [];

  let lastInserted = 'left';
  let insertedSince = 0;
  let articleBlockIndex = 0;
  let articleChunkBlockIndex = 0;
  let articleBlocksCount = articleBlocks.length;

  // This algorithm will cause articles without images to not show up
  // if there are not enough articles with images to display nicely
  while (articleBlocksCount >= 0) {
    const shouldInsertRight = (lastInserted === 'left' && insertedSince === 10) || (articleBlockIndex === 3 && insertedSince === 3);
    const shouldInsertLeft = lastInserted === 'right' && insertedSince === 3;

    if (shouldInsertRight || shouldInsertLeft) {
      blocks.push(articleChunkBlocks[articleChunkBlockIndex]);
      articleChunkBlockIndex++;
      lastInserted = lastInserted === 'left' ? 'right' : 'left';
      insertedSince = 0;
    } else {
      blocks.push(articleBlocks[articleBlockIndex]);
      articleBlockIndex++;
      articleBlocksCount--;
      insertedSince++;
    }
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
      {blocks}
    </div>
  );
}

export default DiscoverArticles;
