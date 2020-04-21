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
      category
      author {
        id
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
