import gql from 'graphql-tag';

const ArticleByIdQuery = gql`
  query article($id: ID!) {
    article(id: $id) {
      id
      title
      headerImageURL
      summary
      content
    }
  }
`;

export default ArticleByIdQuery;
