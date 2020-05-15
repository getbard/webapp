import gql from 'graphql-tag';

const UserCollectionsQuery = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      firstName
      collections {
        id
        name
        articleIds
        public
        userId
      }
    }
  }
`;

export default UserCollectionsQuery;
