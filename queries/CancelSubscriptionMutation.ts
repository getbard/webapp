import gql from 'graphql-tag';

const CancelSubscriptionMutation = gql`
  mutation cancelSubscription($input: CancelSubscriptionInput!) {
    cancelSubscription(input: $input) {
      id
    }
  }
`;

export default CancelSubscriptionMutation;
