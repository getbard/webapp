import gql from 'graphql-tag';

const UsernameQuery = gql`
  query user($username: String!) {
    user(username: $username) {
      username
    }
  }
`;

export default UsernameQuery;
