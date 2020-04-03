import gql from 'graphql-tag';

const UnsplashPhotoQuery = gql`
  query unsplashPhoto($search: String) {
    unsplashPhoto(search: $search) {
      id
      photographerName
      photographerUrl
      urls {
        full
        thumb
      }
    }
  }
`;

export default UnsplashPhotoQuery;
