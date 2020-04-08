import gql from 'graphql-tag';

const CommentsByResourceIdQuery = gql`
  query commentsByResourceId($resourceId: ID!) {
    commentsByResourceId(resourceId: $resourceId) {
      id
      message
      resourceId
      createdAt
      updatedAt
      user {
        username
        firstName
        lastName
      }
      replies {
        id
        message
        resourceId
        createdAt
        updatedAt
        user {
          username
          firstName
          lastName
        }
      }
    }
  }
`;

export default CommentsByResourceIdQuery;
