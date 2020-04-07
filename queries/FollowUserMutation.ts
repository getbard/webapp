import gql from 'graphql-tag';

const FollowUserMutation = gql`
  mutation followUser($input: FollowUserInput!) {
    followUser(input: $input) {
      userId
    }
  }
`;

export default FollowUserMutation;
