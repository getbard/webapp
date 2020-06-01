import { useQuery } from '@apollo/react-hooks';

import { User, Article } from '../generated/graphql';

import MoreArticlesByUserQuery from '../queries/MoreArticlesByUserQuery';

import ArticleCard from './ArticleCard';

function MoreArticles({ author }: { author: User }): React.ReactElement {
  const { data } = useQuery(MoreArticlesByUserQuery, { variables: {
    userId: author.id,
    drafts: false,
    limit: 3,
  } });

  return (
    <div className="mt-10 space-y-1">
      <h2 className="text-3xl font-bold">
        Read more from {author.firstName}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:-mx-20">
        {data?.articlesByUser.map((article: Article) => <ArticleCard key={article.id} article={article} />)}
      </div>
    </div>
  );
}

export default MoreArticles;
