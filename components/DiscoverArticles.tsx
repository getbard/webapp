import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Article } from '../generated/graphql';

import ArticleCard from './ArticleCard';

export const ALL_ARTICLES_QUERY = gql`
  query articles {
    articles {
      id
      title
      content
    }
  }
`;

function DiscoverArticles(): React.ReactElement {
  const { loading, error, data } = useQuery(ALL_ARTICLES_QUERY);

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading</div>;

  return (
    <div>
      {data.articles.map((article: Article) => <ArticleCard key={article.id} data={article} />)}
    </div>
  );
}

export default DiscoverArticles;
