import gql from 'graphql-tag';

const UsernameQuery = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      username
      firstName
      lastName
    }
  }
`;

export default UsernameQuery;
