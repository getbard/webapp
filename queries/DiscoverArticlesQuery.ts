import gql from 'graphql-tag';

const DiscoverArticlesQuery = gql`
  query articles {
    articles {
      id
      title
      headerImage {
        id
        url
      }
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
