import gql from 'graphql-tag';

const PublishArticleMutation = gql`
  mutation publishArticle($input: PublishArticleInput!) {
    publishArticle(input: $input) {
      id
      slug
    }
  }
`;

export default PublishArticleMutation;
