import gql from 'graphql-tag';

const UpdateCollectionMutation = gql`
  mutation updateCollection($input: UpdateCollectionInput!) {
    updateCollection(input: $input) {
      id
    }
  }
`;

export default UpdateCollectionMutation;
