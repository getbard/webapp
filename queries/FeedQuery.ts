import gql from 'graphql-tag';

const FeedQuery = gql`
  query feed {
    feed {
      id
      next
      results {
        id
        is_read
        is_seen
        verb
        actor_count
        activities {
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
            ... on User {
              id
              firstName
              lastName
              username
            }
          }
        }
      }
      unseen
      unread
    }
  }
`;

export default FeedQuery;
