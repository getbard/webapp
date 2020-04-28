import gql from 'graphql-tag';

const UpdateProfileSectionMutation = gql`
  mutation updateProfileSection($input: UpdateProfileSectionInput!) {
    updateProfileSection(input: $input) {
      id
    }
  }
`;

export default UpdateProfileSectionMutation;
