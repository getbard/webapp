import gql from 'graphql-tag';

const UserFollowQuery = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      followerIds
    }
  }
`;

export default UserFollowQuery;
