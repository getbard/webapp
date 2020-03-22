import gql from 'graphql-tag';

const CreateUserMutation = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
    }
  }
`;

export default CreateUserMutation;
