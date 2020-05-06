import gql from 'graphql-tag';

const UpdateStripePlanPriceMutation = gql`
  mutation updateStripePlanPrice($input: UpdateStripePlanPriceInput!) {
    updateStripePlanPrice(input: $input) {
      id
    }
  }
`;

export default UpdateStripePlanPriceMutation;
