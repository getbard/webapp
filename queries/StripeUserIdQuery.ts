import gql from 'graphql-tag';

const StripeUserIdQuery = gql`
  query stripeUserId($username: String!) {
    user(username: $username) {
      id
      stripeUserId
    }
  }
`;

export default StripeUserIdQuery;
