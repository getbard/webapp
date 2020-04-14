import gql from 'graphql-tag';

const UploadImageMutation = gql`
  mutation uploadImage($input: UploadImageInput!) {
    uploadImage(input: $input) {
      url
    }
  }
`;

export default UploadImageMutation;
