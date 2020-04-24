import gql from 'graphql-tag';

const DiscoverArticlesQuery = gql`
  query articles($category: String, $headerCursor: String, $headlessCursor: String) {
    articles(category: $category, headerCursor: $headerCursor, headlessCursor: $headlessCursor) {
      headerCursor
      headlessCursor
      articlesWithHeader {
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
      articlesWithoutHeader {
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
      }
    }
  }
`;

export default DiscoverArticlesQuery;
