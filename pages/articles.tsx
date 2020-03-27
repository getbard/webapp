import { NextPage } from 'next';
import { useQuery } from '@apollo/react-hooks';
import { useState } from 'react';

import { Article } from '../generated/graphql';
import ArticlesSummaryQuery from '../queries/ArticlesSummaryQuery';

import { useAuth } from '../hooks/useAuth';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import ArticleTypeSelector from '../components/ArticleTypeSelector';
import ArticleRow from '../components/ArticleRow';
import PageHeader from '../components/PageHeader';

const Articles: NextPage = (): React.ReactElement => {
  const auth = useAuth();
  const userId = auth.userId || auth.user?.uid;
  const { loading, error, data, refetch } = useQuery(ArticlesSummaryQuery, { variables: { userId, drafts: true } });
  const [articleType, setArticleType] = useState('drafts');

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading</div>;

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
  const articlesToDisplay = articleType === 'drafts' ? drafts : published;

  return (
    <div className="px-5 pt-5 container mx-auto relative">
      <PageHeader>
        Your articles
      </PageHeader>

      <div className="mb-6 pb-4 border-b border-gray-300">
        <ArticleTypeSelector
          name="Drafts"
          count={drafts.length}
          setArticleType={setArticleType}
          articleType={articleType}
        />

        <ArticleTypeSelector
          name="Published"
          count={published.length}
          setArticleType={setArticleType}
          articleType={articleType}
        />
      </div>

      {articlesToDisplay.map((article: Article) => {
        return <ArticleRow key={article.id} article={article} refetch={refetch} />;
      })}
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Articles));
