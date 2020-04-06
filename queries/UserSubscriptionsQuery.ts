import gql from 'graphql-tag';

const UserSubscriptionsQuery = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      subscriptions {
        id
        authorId
        status
        currentPeriodEnd
        createdAt
        cancelAt
        author {
          id
          username
          firstName
          lastName
        }
        plan {
          amount
          currency
          interval
        }
      }
    }
  }
`;

export default UserSubscriptionsQuery;
