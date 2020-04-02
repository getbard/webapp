import gql from 'graphql-tag';

const StripeSessionQuery = gql`
  query stripeSession($id: ID!, $stripeUserId: ID!) {
    stripeSession(id: $id, stripeUserId: $stripeUserId) {
      id
      status
    }
  }
`;

export default StripeSessionQuery;
