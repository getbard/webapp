import gql from 'graphql-tag';

const UnfollowUserMutation = gql`
  mutation unfollowUser($input: UnfollowUserInput!) {
    unfollowUser(input: $input) {
      userId
    }
  }
`;

export default UnfollowUserMutation;
