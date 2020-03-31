import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { format } from 'date-fns';
import { ApolloError } from 'apollo-client';
import Error from 'next/error';

import { Article } from '../generated/graphql';
import AuthorProfileQuery from '../queries/AuthorProfileQuery';
import ArticlesSummaryQuery from '../queries/ArticlesSummaryQuery';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';
import ProfileSectionSelector from '../components/ProfileSectionSelector';
import ArticleRow from '../components/ArticleRow';

function Articles({
  loading,
  error,
  articlesData,
  refetch,
}: {
  loading: boolean;
  error: ApolloError | undefined;
  articlesData: { articlesByUser: Article[] };
  refetch: () => void;
}): React.ReactElement {

  if (error) return <div>Error loading articles!</div>;
  if (loading) return <div>Loading articles...</div>;

  const { articlesByUser } = articlesData;

  return (
    <>
      {articlesByUser.map((article: Article) => {
        return <ArticleRow key={article.id} article={article} refetch={refetch} />;
      })}
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

  if (!user?.id) {
    return <Error statusCode={404} />;
  }

  const {
    loading: articlesLoading,
    error: articlesError,
    data: articlesData,
    refetch,
  } = useQuery(ArticlesSummaryQuery, { variables: { userId: user.id } });

  return (
    <div className="px-5 pt-5 grid grid-cols-4">
      <div className="text-center">
        <div className="text-4xl font-serif font-bold">{user.firstName} {user.lastName}</div>
        <div className="text-xl text-gray-600 mb-2">{username}</div>
        
        <div className="mb-4">
          Joined {format(new Date(user.createdAt), 'MMM yyyy')}
          <div>{user?.followers?.length || 0} following</div>
          <div>{user?.following?.length || 0} followers</div>
        </div>

        <div className="flex justify-center flex-col items-center">
          <Button>Become a supporter</Button>

          <div className="mt-2">
            <Button className="mr-2" secondary>Follow</Button>
            <Button secondary>One-Time Support</Button>
          </div>
        </div>
      </div>

      <div className="col-span-3">
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
            ? (
              <Articles
                loading={articlesLoading}
                error={articlesError}
                articlesData={articlesData}
                refetch={refetch}
              />
            )
            : <div>Feed coming soon!</div>
        }
      </div>
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Author));
