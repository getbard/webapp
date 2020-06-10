import gql from 'graphql-tag';

const ArticlesAnalyticsQuery = gql`
  query articlesAnalytics($userId: ID!) {
    articlesByUser(userId: $userId, drafts: false) {
      id
      title
      summary
      createdAt
      updatedAt
      publishedAt
      subscribersOnly
      wordCount
      analytics {
        totalViews
        totalReads
        totalComments
      }
    }
  }
`;

export default ArticlesAnalyticsQuery;