import gql from 'graphql-tag';

const ArticleByIdQuery = gql`
  query article($id: ID!) {
    article(id: $id) {
      id
      title
      headerImage {
        id
        url
        photographerName
        photographerUrl
      }
      summary
      content
      userId
      subscribersOnly
      contentBlocked
      publishedAt
      author {
        username
        firstName
        lastName
      }
    }
  }
`;

export default ArticleByIdQuery;
