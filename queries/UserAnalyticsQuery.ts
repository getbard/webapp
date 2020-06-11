import gql from 'graphql-tag';

const UserAnalyticsQuery = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      analytics {
        wordsWritten
        subscriberCount
        followerCount
        joinDate
      }
    }
  }
`;

export default UserAnalyticsQuery;
