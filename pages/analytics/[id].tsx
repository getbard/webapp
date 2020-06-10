import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import ArticleAnalyticsFallback from '../../components/ArticleAnalyticsFallback';
import ArticleAnalytics from '../../components/ArticleAnalytics';


const ArticleContainer: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const { id } = router.query;
  
  if (!id) return <ArticleAnalyticsFallback />;

  return <ArticleAnalytics id={id as string} />;
}

export default withApollo({ ssr: false })(withLayout(ArticleContainer));
