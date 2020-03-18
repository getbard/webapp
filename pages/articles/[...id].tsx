import { NextPage } from 'next';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import Editor from '../../components/Editor';

export const ARTICLE_BY_SLUG_QUERY = gql`
  query article($id: String!) {
    articleBySlug(slug: $id) {
      id
      title
      headerImageURL
      summary
      content
    }
  }
`;

export const ARTICLE_BY_ID_QUERY = gql`
  query article($id: ID!) {
    article(id: $id) {
      id
      title
      headerImageURL
      summary
      content
    }
  }
`;

const Article: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const { id: idParams } = router.query;
  const [idType, id] = idParams;
  const articleQuery = idType === 's' ? ARTICLE_BY_SLUG_QUERY : ARTICLE_BY_ID_QUERY;

  const { loading, error, data } = useQuery(articleQuery, { variables: { id } });

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading</div>;

  const { article } = data;

  return (
    <div className="sm:w-3/5 px-5 pt-5 container mx-auto relative">
      <div className="text-4xl w-full font-serif">
        {article.title}
      </div>

      <div className="text-xl w-full mb-4">
        {article?.summary}
      </div>

      <Editor
        readOnly
        initialValue={JSON.parse(article.content)}
      />
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Article));
