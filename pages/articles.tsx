import { NextPage } from 'next';
import { useQuery } from '@apollo/react-hooks';
import { useState } from 'react';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import { Article } from '../generated/graphql';
import ArticlesSummaryQuery from '../queries/ArticlesSummaryQuery';

import { useAuth } from '../hooks/useAuth';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import ArticleTypeSelector from '../components/ArticleTypeSelector';
import ArticleRow from '../components/ArticleRow';
import PageHeader from '../components/PageHeader';
import ArticlesFallback from '../components/ArticlesFallback';
import EmptyState from '../components/EmptyState';

function ArticlesDisplay({
  articleType,
  setDraftCount,
  setPublishedCount,
}: {
  articleType: string;
  setDraftCount: (count: number) => void;
  setPublishedCount: (count: number) => void;
}): React.ReactElement {
  const auth = useAuth();
  const userId = auth.userId || auth.user?.uid;
  const { loading, error, data, refetch } = useQuery(ArticlesSummaryQuery, {
    variables: { userId, drafts: true },
  });

  if (error) return <div>Error</div>;
  if (loading) return <ArticlesFallback />;

  const { articlesByUser } = data;

  const drafts: Article[] = [];
  const published: Article[] = [];
  articlesByUser.forEach((article: Article): void => {
    if (article.publishedAt) {
      published.push(article);
    } else {
      drafts.push(article);
    }
  });

  setDraftCount(drafts.length);
  setPublishedCount(published.length);

  const isDrafts = articleType === 'drafts';
  const articlesToDisplay = isDrafts ? drafts : published;

  if (!articlesToDisplay.length) {
    return (
      <EmptyState title="Ready to share your thoughts?">
        <div>
          You don&apos;t have any {isDrafts ? 'draft' : 'published'} articles.
        </div>

        <Link href="/write">
          <a className="underline">
            Write one today!
          </a>
        </Link>
      </EmptyState>
    );
  }

  return (
    <>
      {articlesToDisplay.map((article: Article) => {
        return <ArticleRow key={article.id} article={article} refetch={refetch} />;
      })}
    </>
  );
}

const Articles: NextPage = (): React.ReactElement => {
  const [draftCount, setDraftCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [articleType, setArticleType] = useState('drafts');

  return (
    <div className="px-5 pt-5 container mx-auto relative">
      <NextSeo
        title="Articles"
        description="Get a glimpse at everything you've written."
      />

      <PageHeader>
        Your articles
      </PageHeader>

      <div className="mb-2 pb-4 border-b-2 border-gray-300">
        <ArticleTypeSelector
          name="Drafts"
          count={draftCount}
          setArticleType={setArticleType}
          articleType={articleType}
        />

        <ArticleTypeSelector
          name="Published"
          count={publishedCount}
          setArticleType={setArticleType}
          articleType={articleType}
        />
      </div>

      <ArticlesDisplay
        articleType={articleType}
        setDraftCount={setDraftCount}
        setPublishedCount={setPublishedCount}
      />
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Articles));
