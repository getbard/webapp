import gql from 'graphql-tag';

const CollectionQuery = gql`
  query collection($id: ID!) {
    collection(id: $id) {
      id
      name
      description
      userId
    }
  }
`;

export default CollectionQuery;
