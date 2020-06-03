import gql from 'graphql-tag';

const AuthorProfileQuery = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      firstName
      lastName
      username
      profileImageURL
      createdAt
      followingIds
      followerIds
      subscribers
      stripeUserId
      avatarUrl
      stripePlan {
        id
        amount
        currency
        interval
      }
      profileSections {
        id
        title
      }
      collections {
        id
      }
    }
  }
`;

export default AuthorProfileQuery;
