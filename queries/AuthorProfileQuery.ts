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
    }
  }
`;

export default AuthorProfileQuery;
