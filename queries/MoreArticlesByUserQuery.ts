import gql from 'graphql-tag';

const MoreArticlesByUserQuery = gql`
  query moreArticlesByUser($userId: ID!, $drafts: Boolean) {
    articlesByUser(userId: $userId, drafts: $drafts, limit: 3) {
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

export default MoreArticlesByUserQuery;