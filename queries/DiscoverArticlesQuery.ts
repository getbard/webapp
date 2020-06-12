import gql from 'graphql-tag';

const DiscoverArticlesQuery = gql`
  query articles($category: String, $cursor: String) {
    articles(category: $category, cursor: $cursor) {
      cursor
      articles {
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
  }
`;

export default DiscoverArticlesQuery;
