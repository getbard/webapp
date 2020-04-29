import gql from 'graphql-tag';

const ArticleByIdQuery = gql`
  query article($id: ID!) {
    article(id: $id) {
      id
      title
      wordCount
      summary
      content
      userId
      subscribersOnly
      contentBlocked
      publishedAt
      updatedAt
      category
      author {
        id
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
        downloadUrl
      }
    }
  }
`;

export const ArticleByIdQueryString = `
  query article($id: ID!) {
    article(id: $id) {
      id
      title
      wordCount
      summary
      content
      userId
      subscribersOnly
      contentBlocked
      publishedAt
      updatedAt
      category
      author {
        id
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
        downloadUrl
      }
    }
  }
`;

export default ArticleByIdQuery;
