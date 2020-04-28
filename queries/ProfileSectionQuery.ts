import gql from 'graphql-tag';

const ProfileSectionQuery = gql`
  query profileSection($id: ID!) {
    profileSection(id: $id) {
      id
      title
      content
      userId
      headerImage {
        id
        url
        photographerName
        photographerUrl
      }
    }
  }
`;

export default ProfileSectionQuery;
