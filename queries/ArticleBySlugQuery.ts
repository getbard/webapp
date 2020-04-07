import gql from 'graphql-tag';

const ArticleBySlugQuery = gql`
  query article($id: String!) {
    articleBySlug(slug: $id) {
      id
      title
      wordCount
      summary
      content
      publishedAt
      subscribersOnly
      contentBlocked
      author {
        username
        firstName
        lastName
        stripeUserId
        stripePlan {
          id
          amount
          currency
          interval
        }
      }
      headerImage {
        id
        url
        photographerName
        photographerUrl
      }
    }
  }
`;

export default ArticleBySlugQuery;
