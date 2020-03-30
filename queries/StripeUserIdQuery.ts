import gql from 'graphql-tag';

const StripeUserIdQuery = gql`
  query stripeUserId {
    me {
      id
      stripeUserId
    }
  }
`;

export default StripeUserIdQuery;
