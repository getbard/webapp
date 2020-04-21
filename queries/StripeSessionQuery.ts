import gql from 'graphql-tag';

const StripeSessionQuery = gql`
  query stripeSession($id: ID!, $stripeUserId: ID!, $authorId: ID!) {
    stripeSession(id: $id, stripeUserId: $stripeUserId, authorId: $authorId) {
      id
      status
      subscription
    }
  }
`;

export default StripeSessionQuery;
