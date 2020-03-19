import gql from 'graphql-tag';

const DiscoverArticlesQuery = gql`
  query articles {
    articles {
      id
      title
      headerImageURL
      summary
      content
    }
  }
`;

export default DiscoverArticlesQuery;
