import gql from 'graphql-tag';

const AuthorProfileQuery = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      firstName
      lastName
      username
      profileImageURL
      createdAt
      following
      followers
      stripeUserId
      stripePlan {
        id
        amount
        currency
        interval
      }
    }
  }
`;

export default AuthorProfileQuery;
