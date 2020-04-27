import styled from '@emotion/styled';
import Link from 'next/link';

import { Article } from '../generated/graphql';

import EmptyState from './EmptyState';
import ArticleCard from './ArticleCard';
import SmallArticleCard from './SmallArticleCard';

const ArticleChunkContainer = styled.div`
  > div:not(:first-of-type) {
    padding-top: 0.5rem;
  }
`;

function DiscoverArticles({
  articlesWithHeader,
  articlesWithoutHeader,
  category,
}: {
  articlesWithHeader: Article[];
  articlesWithoutHeader: Article[];
  category: string;
}): React.ReactElement {
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

  const articleChunks: Article[][] = [];
  const articleBlocks = [];

  for (let i = 0; i < articlesWithoutHeader.length; i += 6) {
    articleChunks.push(articlesWithoutHeader.slice(i, i + 6));
  }

  let articleWithHeaderIndex = 0;
  for (let i = 0; i < articleChunks.length; i++) {
    const sampleArticlesWithHeader = articlesWithHeader.slice(articleWithHeaderIndex, articleWithHeaderIndex + 6);

    const cards = sampleArticlesWithHeader.map((article: Article) => {
      return <ArticleCard key={article.id} article={article} />;
    });

    articleBlocks.push(cards);
    articleWithHeaderIndex += 6;
  }

  for (let i = articleWithHeaderIndex; i < articlesWithHeader.length; i += 8) {
    const sampleArticlesWithHeader = articlesWithHeader.slice(i, i + 8);

    const cards = sampleArticlesWithHeader.map((article: Article) => {
      return <ArticleCard key={article.id} article={article} />;
    });

    articleBlocks.push(cards);
  }

  const articleChunkBlocks = articleChunks.map((articleChunk: Article[], index: number) => {
    return (
        <ArticleChunkContainer
          key={index}
          className="row-span-2 col-span-1 border border-gray-300 p-2 md:grid lg:block grid-cols-2 divide-y"
        >
          {articleChunk.map((article: Article) => {
            return (
              <SmallArticleCard key={article.id} article={article} />
            );
          })}

          {
            articleChunk.length < 6 && (
              <div className="text-center my-4">
                <a 
                  className="font-bold"
                  href="https://feedback.getbard.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(): void => window.analytics.track('DISCOVER: Feedback clicked')}
                >
                  Have a feature request? Let us know!
                </a>
              </div>  
            )
          }
        </ArticleChunkContainer>
    )
  });

  const blocks = [];

  let lastInserted = 'left';

  // This algorithm will cause articles without images to not show up
  // if there are not enough articles with images to display nicely
  for (let i = 0; i < articleBlocks.length; i++) {
    if (i > articleChunkBlocks.length || !articleChunkBlocks.length) {
      blocks.push(
        <div key={`block-${i}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 col-span-1 lg:col-span-4 row-span-2">
          {articleBlocks[i]}
        </div>
      );
    } else {
      const rowSpan = articleBlocks[i].length === 3 ? 'row-span-1' : 'row-span-2';
      const articleBlock = (
        <div key={`block-${i}`} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 col-span-1 lg:col-span-3 ${rowSpan}`}>
          {articleBlocks[i]}
        </div>
      );

      if (lastInserted === 'left') {
        blocks.push(articleBlock);

        if (articleBlocks[i].length >= 3) {
          blocks.push(articleChunkBlocks[i]);
          lastInserted = 'right';
        }
      } else {
        blocks.push(articleChunkBlocks[i]);
        blocks.push(articleBlock);
        lastInserted = 'left';
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-3">
      {blocks}
    </div>
  );
}

export default DiscoverArticles;
