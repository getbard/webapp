import gql from 'graphql-tag';

const UnsplashPhotoQuery = gql`
  query unsplashPhoto($search: String) {
    unsplashPhoto(search: $search) {
      id
      photographerName
      urls {
        full
        thumb
      }
    }
  }
`;

export default UnsplashPhotoQuery;
