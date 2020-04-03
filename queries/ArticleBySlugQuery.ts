import gql from 'graphql-tag';

const ArticleBySlugQuery = gql`
  query article($id: String!) {
    articleBySlug(slug: $id) {
      id
      title
      headerImage {
        id
        url
        photographerName
        photographerUrl
      }
      summary
      content
      publishedAt
      subscribersOnly
      contentBlocked
      author {
        username
        firstName
        lastName
      }
    }
  }
`;

export default ArticleBySlugQuery;
