import gql from 'graphql-tag';

const FeedQuery = gql`
  query feed {
    feed {
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
      unseen
      unread
    }
  }
`;

export default FeedQuery;
