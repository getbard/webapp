import gql from 'graphql-tag';

const DeleteArticleMutation = gql`
  mutation deleteArticle($input: DeleteArticleInput!) {
    deleteArticle(input: $input) {
      id
    }
  }
`;

export default DeleteArticleMutation;
