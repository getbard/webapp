import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { XMasonry, XBlock } from 'react-xmasonry';

import { Article } from '../generated/graphql';

import ArticleCard from './ArticleCard';

export const ALL_ARTICLES_QUERY = gql`
  query articles {
    articles {
      id
      title
      headerImageURL
      summary
      content
    }
  }
`;

function DiscoverArticles(): React.ReactElement {
  const { loading, error, data } = useQuery(ALL_ARTICLES_QUERY);

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
