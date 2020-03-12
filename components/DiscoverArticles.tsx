import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const ALL_ARTICLES_QUERY = gql`
  query articles {
    articles {
      id
      title
      content
    }
  }
`;

function DiscoverArticles(): React.ReactElement {
  const { loading, error, data } = useQuery(ALL_ARTICLES_QUERY);

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading</div>;

  console.log(data);

  return (
    <div>
      Articles!
    </div>
  );
}

export default DiscoverArticles;
