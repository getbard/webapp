import { NextPage } from 'next';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

import { Article } from '../generated/graphql';

import { useAuth } from '../hooks/useAuth';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';

export const ARTICLES_BY_USER = gql`
  query articles($userId: ID!) {
    articlesByUser(userId: $userId) {
      id
      title
      summary
      updatedAt
      subscribersOnly
      draft
    }
  }
`;

type ArticleTypeSelectorProps = {
  articleType: string;
  setArticleType: (name: string) => void;
  name: string;
  count: number;
}

function ArticleTypeSelector({
  articleType,
  setArticleType,
  name,
  count,
}: ArticleTypeSelectorProps): React.ReactElement {
  return (
    <div
      className={`${articleType !== name.toLowerCase() && 'text-gray-500'} inline mr-8 text-2xl hover:cursor-pointer`}
      onClick={(): void => setArticleType(name.toLowerCase())}
    >
      {name} ({count})
    </div>
  );
}

function ArticleRow({ article }: { article: Article }): React.ReactElement {
  return (
    <div className="border-b border-gray-200 my-2 py-4 flex justify-between items-center">
      <div>
        {
          article.draft
            ? (
              <div className="text-3xl font-serif flex items-center">
                {article.title}
                &nbsp;{article.subscribersOnly && <span className="text-xs uppercase tracking-widest bg-primary rounded-full text-white px-2 py-1 font-sans">Premium</span>}
              </div>
            )
            : (
              <Link href={`/articles/i/${article.id}`}>
                <a className="text-3xl font-serif flex items-center hover:text-primary hover:cursor-pointer">
                  {article.title}
                  &nbsp;{article.subscribersOnly && <span className="text-xs uppercase tracking-widest bg-primary rounded-full text-white px-2 py-1 font-sans">Premium</span>}
                </a>
              </Link>
            ) 
        }

        <div className="text-lg w-full mb-4">
          {article?.summary}
        </div>

        <div className="text-xs">
          Updated {formatDistanceToNow(new Date(article.updatedAt))} ago
        </div>
      </div>

      <div>
        <div className="inline hover:text-primary hover:cursor-pointer font-medium mr-4">Edit</div>
        <div className="inline text-red-600 hover:text-red-900 hover:cursor-pointer font-medium">Delete</div>
      </div>
    </div>
  );
}

const Articles: NextPage = (): React.ReactElement => {
  const auth = useAuth();
  const userId = auth.userId || auth.user?.uid;
  const { loading, error, data } = useQuery(ARTICLES_BY_USER, { variables: { userId } });
  const [articleType, setArticleType] = useState('drafts');

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading</div>;

  const { articlesByUser } = data;

  const drafts: Article[] = [];
  const published: Article[] = [];
  articlesByUser.forEach((article: Article): void => {
    if (article.draft) {
      drafts.push(article);
    } else {
      published.push(article);
    }
  });
  const articlesToDisplay = articleType === 'drafts' ? drafts : published;

  return (
    <div className="px-5 pt-5 container mx-auto relative">
      <h1 className="text-4xl font-serif font-bold mb-2">
        Your articles
      </h1>

      <div className="mb-6 border-b border-gray-300">
        <ArticleTypeSelector
          name="Drafts"
          count={drafts.length}
          setArticleType={setArticleType}
          articleType={articleType}
        />

        <ArticleTypeSelector
          name="Published"
          count={published.length}
          setArticleType={setArticleType}
          articleType={articleType}
        />
      </div>

      {articlesToDisplay.map((article: Article) => <ArticleRow key={article.id} article={article} />)}
    </div>
  );
}

export default withApollo()(withLayout(Articles));
