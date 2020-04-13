import gql from 'graphql-tag';

const ProfileFeedQuery = gql`
  query profileFeed($userId: ID) {
    profileFeed(userId: $userId) {
      next
      results {
        id
        actor {
          id
          firstName
          lastName
          username
        }
        verb
        time
        object {
          ... on Article {
            slug
            title
            summary
            headerImage {
              url
            }
            author {
              firstName
              lastName
              username
            }
          }
          ... on Comment {
            message
            resource {
              id
              slug
              title
              author {
                id
                firstName
                lastName
                username
              }
            }
            user {
              firstName
              lastName
              username
            }
          }
          ... on User {
            id
            firstName
            lastName
            username
          }
        }
      }
    }
  }
`;

export default ProfileFeedQuery;
