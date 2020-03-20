import gql from 'graphql-tag';

const ArticlesSummaryQuery = gql`
  query articlesSummary($userId: ID!) {
    articlesByUser(userId: $userId) {
      id
      title
      summary
      updatedAt
      publishedAt
      subscribersOnly
      draft
    }
  }
`;

export default ArticlesSummaryQuery;