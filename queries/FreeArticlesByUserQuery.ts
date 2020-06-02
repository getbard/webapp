import gql from 'graphql-tag';

const FreeArticlesByUserQuery = gql`
  query freeArticlesByUser($userId: ID!, $limit: Int) {
    freeArticlesByUser(userId: $userId, limit: $limit) {
      id
      title
      summary
      createdAt
      updatedAt
      publishedAt
      subscribersOnly
      slug
      userId
      wordCount
      headerImage {
        id
        url
      }
      author {
        id
        firstName
        lastName
      }
    }
  }
`;

export default FreeArticlesByUserQuery;