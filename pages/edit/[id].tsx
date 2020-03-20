import { NextPage } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';

import ArticleByIdQuery from '../../queries/ArticleByIdQuery';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import EditorContainer from '../../components/EditorContainer';

const Edit: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(ArticleByIdQuery, { variables: { id } });

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading</div>;

  const { article } = data;

  return (
    <EditorContainer article={article} />
  );
}

export default withApollo({ ssr: true })(withLayout(Edit));
