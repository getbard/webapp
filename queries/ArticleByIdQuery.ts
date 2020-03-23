import gql from 'graphql-tag';

const ArticleByIdQuery = gql`
  query article($id: ID!) {
    article(id: $id) {
      id
      title
      headerImageURL
      summary
      content
      userId
      subscribersOnly
      publishedAt
      author {
        firstName
        lastName
      }
    }
  }
`;

export default ArticleByIdQuery;
