import gql from 'graphql-tag';

const CreateArticleMutation = gql`
  mutation createArticle($input: CreateOrUpdateArticleInput!) {
    createArticle(input: $input) {
      id
    }
  }
`;

export default CreateArticleMutation;
