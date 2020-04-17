import gql from 'graphql-tag';

const UpdateUserMutation = gql`
  mutation updateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
    }
  }
`;

export default UpdateUserMutation;
