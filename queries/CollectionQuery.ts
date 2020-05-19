import gql from 'graphql-tag';

const CollectionQuery = gql`
  query collection($id: ID!) {
    collection(id: $id) {
      id
      name
      description
      userId
      articleIds
      public
      articles {
        id
        title
        summary
        slug
        publishedAt
        subscribersOnly
        wordCount
        category
        author {
          id
          username
          firstName
          lastName
        }
        headerImage {
          id
          url
        }
      }
      user {
        id
        username
        firstName
        lastName
      }
    }
  }
`;

export default CollectionQuery;
