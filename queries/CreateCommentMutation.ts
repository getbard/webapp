import gql from 'graphql-tag';

const CreateCommentMutation = gql`
  mutation createComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      message
      createdAt
    }
  }
`;

export default CreateCommentMutation;
