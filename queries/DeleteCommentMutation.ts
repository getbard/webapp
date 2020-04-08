import gql from 'graphql-tag';

const DeleteCommentMutation = gql`
  mutation deleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      id
      deletedAt
    }
  }
`;

export default DeleteCommentMutation;
