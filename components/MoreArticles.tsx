import { useQuery } from '@apollo/react-hooks';

import { User, Article } from '../generated/graphql';

import MoreArticlesByUserQuery from '../queries/MoreArticlesByUserQuery';

import ArticleCard from './ArticleCard';

function MoreArticles({ author, article }: { author: User; article: Article }): React.ReactElement {
  const { data } = useQuery(MoreArticlesByUserQuery, { variables: {
    userId: author.id,
    drafts: false,
    limit: 4,
  }});

  const articlesToDisplay = data?.articlesByUser.filter((currArticle: Article) => article.id !== currArticle.id).slice(0, 3);

  if (!articlesToDisplay?.length) {
    return <></>;
  }

  return (
    <div className="mt-10 space-y-1">
      <h2 className="text-3xl font-bold">
        Read more from {author.firstName}
      </h2>

      <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center md:-mx-20">
        {articlesToDisplay.map((article: Article) => <ArticleCard key={article.id} article={article} />)}
      </div>
    </div>
  );
}

export default MoreArticles;
