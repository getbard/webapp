import gql from 'graphql-tag';

const CreateStripeSessionMutation = gql`
  mutation createStripeSession($input: CreateStripeSessionInput!) {
    createStripeSession(input: $input) {
      id
    }
  }
`;

export default CreateStripeSessionMutation;
