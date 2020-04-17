import gql from 'graphql-tag';

const UserAccountSettingsQuery = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      firstName
      lastName
      email
      username
    }
  }
`;

export default UserAccountSettingsQuery;
