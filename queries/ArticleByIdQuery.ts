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
    }
  }
`;

export default ArticleByIdQuery;
