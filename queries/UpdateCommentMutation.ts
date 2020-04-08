import gql from 'graphql-tag';

const UpdateCommentMutation = gql`
  mutation updateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      id
      updatedAt
    }
  }
`;

export default UpdateCommentMutation;
