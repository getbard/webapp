import gql from 'graphql-tag';

const StripeSettingsQuery = gql`
  query stripeSettings($username: String!) {
    user(username: $username) {
      id
      stripeUserId
      stripeDashboardUrl
      stripePlan {
        id
        amount
        currency
        interval
      }
      subscribers
    }
  }
`;

export default StripeSettingsQuery;
