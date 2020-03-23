import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { format } from 'date-fns';
import { ApolloError } from 'apollo-client';

import { Article } from '../generated/graphql';
import AuthorProfileQuery from '../queries/AuthorProfileQuery';
import ArticlesSummaryQuery from '../queries/ArticlesSummaryQuery';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import Button from '../components/Button';
import ProfileSectionSelector from '../components/ProfileSectionSelector';
import ArticleRow from '../components/ArticleRow';

function Articles({
  loading,
  error,
  articlesData,
}: {
  loading: boolean;
  error: ApolloError | undefined;
  articlesData: { articlesByUser: Article[] };
}): React.ReactElement {

  if (error) return <div>Error loading articles!</div>;
  if (loading) return <div>Loading articles...</div>;

  const { articlesByUser } = articlesData;

  return (
    <>
      {articlesByUser.map((article: Article) => <ArticleRow key={article.id} article={article} />)}
    </>
  );
}

const Author: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const { username } = router.query;
  const { loading, error, data } = useQuery(AuthorProfileQuery, { variables: { username } });
  const [section, setSection] = useState('articles');

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading</div>;

  const { user } = data;

  const {
    loading: articlesLoading,
    error: articlesError,
    data: articlesData,
  } = useQuery(ArticlesSummaryQuery, { variables: { userId: user.id } });

  return (
    <div className="px-5 pt-5 grid grid-cols-3">
      <div>
        <div className="text-4xl font-serif font-bold">{user.firstName} {user.lastName}</div>
        <div className="text-xl text-gray-600 mb-2">{username}</div>
        
        <div className="mb-4">
          Joined {format(new Date(user.createdAt), 'MMM yyyy')}
          <div>{user?.followers?.length || 0} following</div>
          <div>{user?.following?.length || 0} followers</div>
        </div>

        <div>
          <Button className="mr-4">Donate</Button>
          <Button>Subscribe</Button>
        </div>
      </div>

      <div className="col-span-2">
        <div className="mb-6 pb-4 border-b border-gray-300">
          <ProfileSectionSelector
            name="Articles"
            setSection={setSection}
            section={section}
          />

          <ProfileSectionSelector
            name="Activity"
            setSection={setSection}
            section={section}
          />
        </div>

        {
          section === 'articles'
            ? <Articles loading={articlesLoading} error={articlesError} articlesData={articlesData} />
            : <div>Feed coming soon!</div>
        }
      </div>
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Author));
