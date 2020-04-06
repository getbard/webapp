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
      subscriptions {
        userId
      }
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
