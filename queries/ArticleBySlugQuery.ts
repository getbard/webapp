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
      updatedAt
      subscribersOnly
      contentBlocked
      category
      author {
        id
        username
        firstName
        lastName
        avatarUrl
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

export const ArticleBySlugQueryString = `
  query article($id: String!) {
    articleBySlug(slug: $id) {
      id
      title
      wordCount
      summary
      content
      publishedAt
      updatedAt
      subscribersOnly
      contentBlocked
      category
      author {
        id
        username
        firstName
        lastName
        avatarUrl
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
