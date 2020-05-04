import gql from 'graphql-tag';

const UpdateArticleMutation = gql`
  mutation updateArticle($input: CreateOrUpdateArticleInput!) {
    updateArticle(input: $input) {
      id
    }
  }
`;

export default UpdateArticleMutation;
