import Link from 'next/link';

import { Article } from '../generated/graphql';

import EmptyState from './EmptyState';
import ArticleCard from './ArticleCard';

function DiscoverArticles({
  articles,
  category,
}: {
  articles: Article[];
  category: string;
}): React.ReactElement {
  if (!articles.length) {
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

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
      {articles.map((article: Article) => {
        return <ArticleCard key={article.id} article={article} />;
      })}
    </div>
  );
}

export default DiscoverArticles;
