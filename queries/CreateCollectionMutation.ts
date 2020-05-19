import gql from 'graphql-tag';

const CreateCollectionMutation = gql`
  mutation createCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
    }
  }
`;

export default CreateCollectionMutation;
