import gql from 'graphql-tag';

const UserSupportQuery = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      subscribers
    }
  }
`;

export default UserSupportQuery;
