import gql from 'graphql-tag';

const StripeSessionQuery = gql`
  query stripeSession($id: ID!) {
    stripeSession(id: $id) {
      id
      status
    }
  }
`;

export default StripeSessionQuery;
