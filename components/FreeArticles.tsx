import { useQuery } from '@apollo/react-hooks';

import { User, Article } from '../generated/graphql';

import FreeArticlesByUserQuery from '../queries/FreeArticlesByUserQuery';

import ArticleCard from './ArticleCard';

function FreeArticles({ author }: { author: User }): React.ReactElement {
  const { data } = useQuery(FreeArticlesByUserQuery, { variables: {
    userId: author.id,
    limit: 3,
  }});

  if (!data?.freeArticlesByUser?.length) {
    return <></>;
  }

  return (
    <div className="mt-10 space-y-1">
      <h2 className="text-3xl font-bold">
        Read free articles from {author.firstName}
      </h2>

      <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center md:-mx-20">
        {data?.freeArticlesByUser?.map((article: Article) => <ArticleCard key={article.id} article={article} />)}
      </div>
    </div>
  );
}

export default FreeArticles;
