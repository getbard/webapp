import gql from 'graphql-tag';

const ArticleBySlugQuery = gql`
  query article($id: String!) {
    articleBySlug(slug: $id) {
      id
      title
      wordCount
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
      headerImage {
        id
        url
        photographerName
        photographerUrl
      }
    }
  }
`;

export default ArticleBySlugQuery;
