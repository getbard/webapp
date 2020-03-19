import gql from 'graphql-tag';

const CreateOrUpdateArticleMutation = gql`
  mutation createOrUpdateArticle($input: CreateOrUpdateArticleInput!) {
    createOrUpdateArticle(input: $input) {
      id
    }
  }
`;

export default CreateOrUpdateArticleMutation;
