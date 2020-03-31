import gql from 'graphql-tag';

const DiscoverArticlesQuery = gql`
  query articles {
    articles {
      id
      title
      headerImageURL
      summary
      content
      slug
      publishedAt
      subscribersOnly
      author {
        username
        firstName
        lastName
      }
    }
  }
`;

export default DiscoverArticlesQuery;
