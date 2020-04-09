import gql from 'graphql-tag';

const DiscoverArticlesQuery = gql`
  query articles($category: String) {
    articles(category: $category) {
      id
      title
      summary
      content
      slug
      publishedAt
      subscribersOnly
      wordCount
      author {
        username
        firstName
        lastName
      }
      headerImage {
        id
        url
      }
    }
  }
`;

export default DiscoverArticlesQuery;
