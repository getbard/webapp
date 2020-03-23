import gql from 'graphql-tag';

const ArticleBySlugQuery = gql`
  query article($id: String!) {
    articleBySlug(slug: $id) {
      id
      title
      headerImageURL
      summary
      content
      publishedAt
      author {
        username
        firstName
        lastName
      }
    }
  }
`;

export default ArticleBySlugQuery;
