import gql from 'graphql-tag';

const CreateProfileSectionMutation = gql`
  mutation createProfileSection($input: CreateProfileSectionInput!) {
    createProfileSection(input: $input) {
      id
    }
  }
`;

export default CreateProfileSectionMutation;
