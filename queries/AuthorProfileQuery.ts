import gql from 'graphql-tag';

const AuthorProfileQuery = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      firstName
      lastName
      profileImageURL
      createdAt
      following
      followers
    }
  }
`;

export default AuthorProfileQuery;
