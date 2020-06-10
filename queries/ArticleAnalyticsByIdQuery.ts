import gql from 'graphql-tag';

const ArticleAnalyticsById = gql`
  query article($id: ID!) {
    article(id: $id) {
      id
      title
      wordCount
      summary
      subscribersOnly
      publishedAt
      category
      headerImage {
        id
      }
      comments {
        id
      }
      analytics {
        totalViews
        totalReads
        totalComments
        reads {
          date
          count
        }
        views {
          date
          count
        }
      }
    }
  }
`;

export default ArticleAnalyticsById;
