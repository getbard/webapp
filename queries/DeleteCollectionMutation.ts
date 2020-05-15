import gql from 'graphql-tag';

const DeleteCollectionMutation = gql`
  mutation deleteCollection($input: DeleteCollectionInput!) {
    deleteCollection(input: $input) {
      id
      deletedAt
    }
  }
`;

export default DeleteCollectionMutation;
