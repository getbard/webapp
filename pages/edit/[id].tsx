import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import Error from 'next/error';
import { NextSeo } from 'next-seo';

import { useAuth } from '../../hooks/useAuth';

import ArticleByIdQuery from '../../queries/ArticleByIdQuery';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import EditorContainer from '../../components/EditorContainer';
import GenericLoader from '../../components/GenericLoader';
import GenericError from '../../components/GenericError';

const Edit: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const auth = useAuth();
  const { id } = router.query;
  const { loading, error, data } = useQuery(ArticleByIdQuery, { variables: { id } });

  if (loading || !auth?.user?.uid) return <GenericLoader />;
  if (error) return <div><GenericError title /></div>;

  const { article } = data;

  if (auth?.user?.uid !== article.userId) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <NextSeo
        title={`Edit ${article.title}`}
        description="Edit your article on Bard."
      />

      <EditorContainer article={article} />
    </>
  );
}

export default withApollo({ ssr: true })(withLayout(Edit));
