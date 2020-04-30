import gql from 'graphql-tag';

const DeleteProfileSectionMutation = gql`
  mutation deleteProfileSection($input: DeleteProfileSectionInput!) {
    deleteProfileSection(input: $input) {
      id
      deletedAt
    }
  }
`;

export default DeleteProfileSectionMutation;
