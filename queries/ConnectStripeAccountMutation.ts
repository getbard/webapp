import gql from 'graphql-tag';

const ConnectStripeAccountMutation = gql`
  mutation connectStripeAccount($input: ConnectStripeAccountInput!) {
    connectStripeAccount(input: $input) {
      success
    }
  }
`;

export default ConnectStripeAccountMutation;
