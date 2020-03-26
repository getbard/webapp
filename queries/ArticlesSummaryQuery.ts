import gql from 'graphql-tag';

const ArticlesSummaryQuery = gql`
  query articlesSummary($userId: ID!, $drafts: Boolean) {
    articlesByUser(userId: $userId, drafts: $drafts) {
      id
      title
      summary
      updatedAt
      publishedAt
      subscribersOnly
      slug
      userId
    }
  }
`;

export default ArticlesSummaryQuery;