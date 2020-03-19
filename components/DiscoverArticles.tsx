import { useQuery } from '@apollo/react-hooks';
import { XMasonry, XBlock } from 'react-xmasonry';

import { Article } from '../generated/graphql';
import DiscoverArticlesQuery from '../queries/DiscoverArticlesQuery';

import ArticleCard from './ArticleCard';

function DiscoverArticles(): React.ReactElement {
  const { loading, error, data } = useQuery(DiscoverArticlesQuery);

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading</div>;
  
  return (
    <XMasonry>
      {data.articles.map((article: Article) => {
        return (
          <XBlock key={article.id}>
            <ArticleCard article={article} />
          </XBlock>
        );
      })}
    </XMasonry>
  );
}

export default DiscoverArticles;
