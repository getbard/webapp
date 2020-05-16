import gql from 'graphql-tag';

const ProfileFeedQuery = gql`
  query profileFeed($userId: ID) {
    profileFeed(userId: $userId) {
      id
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
        collectedArticle
        object {
          ... on Article {
            id
            slug
            title
            summary
            wordCount
            headerImage {
              id
              url
            }
            author {
              id
              firstName
              lastName
              username
            }
          }
          ... on Comment {
            id
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
              id
              firstName
              lastName
              username
            }
          }
          ... on Collection {
            id
            name
            articles {
              id
              slug
              title
              summary
              wordCount
              headerImage {
                id
                url
              }
              author {
                id
                firstName
                lastName
                username
              }
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
