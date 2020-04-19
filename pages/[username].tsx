import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { format } from 'date-fns';
import { ApolloError } from 'apollo-client';
import Error from 'next/error';
import { NextSeo } from 'next-seo';

import { Article, User } from '../generated/graphql';
import AuthorProfileQuery from '../queries/AuthorProfileQuery';
import ArticlesSummaryQuery from '../queries/ArticlesSummaryQuery';

import { useAuth } from '../hooks/useAuth';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import ProfileSectionSelector from '../components/ProfileSectionSelector';
import ArticleRow from '../components/ArticleRow';
import FollowButton from '../components/FollowButton';
import BecomeSupporterButton from '../components/BecomeSupporterButton';
import OneTimeSupportButton from '../components/OneTimeSupportButton';
import SupportConfirmation from '../components/SupportConfirmation';
import ArticlesFallback from '../components/ArticlesFallback';
import UserProfileFallback from '../components/UserProfileFallback';
import EmptyState from '../components/EmptyState';
import ProfileFeed from '../components/ProfileFeed';
import GenericError from '../components/GenericError';

function Articles({
  loading,
  error,
  articlesData,
  refetch,
  name,
}: {
  loading: boolean;
  error: ApolloError | undefined;
  articlesData: { articlesByUser: Article[] };
  refetch: () => void;
  name: string;
}): React.ReactElement {

  if (loading) return <ArticlesFallback />;

  if (error) return <div><GenericError title /></div>;

  const { articlesByUser } = articlesData;

  if (!articlesByUser.length) {
    return (
      <EmptyState title={`They're working on it.`}>
        <div>
          {name} hasn&apos;t written anything yet.
        </div>

        <div>
          Follow them to be notified when they publish an article!
        </div>
      </EmptyState>
    );
  }

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
  const auth = useAuth();
  const { username, sessionId, support } = router.query;
  const [section, setSection] = useState('articles');
  const { loading, error, data } = useQuery(AuthorProfileQuery, { variables: { username } });

  if (loading) return <UserProfileFallback />;
  if (error) return <div><GenericError title /></div>;

  const { user }: { user: User } = data;

  if (!user?.id) {
    return <Error statusCode={404} />;
  }

  const isSubscriber = user?.subscribers?.some(subscriber => subscriber === auth?.userId);

  const {
    loading: articlesLoading,
    error: articlesError,
    data: articlesData,
    refetch,
  } = useQuery(ArticlesSummaryQuery, { variables: { userId: user.id } });

  return (
    <div className="px-5 pt-5 grid grid-cols-4 gap-5">
      <NextSeo
        title={`Edit ${username}`}
        description={`Read and support ${user.username} on Bard.`}
      />

      <div className="text-center break-words">
        <div className="text-4xl font-serif font-bold">{user.firstName} {user.lastName}</div>
        <div className="text-xl text-gray-600 mb-2">{user.username}</div>
        
        <div className="mb-4">
          Joined {format(new Date(user.createdAt), 'MMM yyyy')}
          <div>{user?.followingIds?.length || 0} following</div>
          <div>{user?.followerIds?.length || 0} followers</div>
        </div>

        {
          user.id !== auth.userId && (
            <div className="flex justify-center flex-col items-center">
              {isSubscriber && (
                <span className="font-bold mb-2">
                  Thanks for being a supporter!
                </span>
              )}

              {user?.stripeUserId && user?.stripePlan && !isSubscriber && (
                <BecomeSupporterButton
                  author={user}
                  displayModal={!!support}
                />
              )}

              <div className="mt-2">
                <FollowButton
                  className="mr-2"
                  user={user}
                  follower={auth.userId || ''}
                />

                {user?.stripeUserId && (
                  <OneTimeSupportButton
                    stripeUserId={user?.stripeUserId || ''}
                    author={user}
                  />
                )}
              </div>
            </div>
          )
        }
      </div>

      <div className="col-span-3">
        <div className="mb-2 pb-4 border-b-2 border-gray-300">
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
                name={user.firstName}
                loading={articlesLoading}
                error={articlesError}
                articlesData={articlesData}
                refetch={refetch}
              />
            )
            : <ProfileFeed userId={user.id} name={user.firstName} />
        }
      </div>

      {sessionId && user?.stripeUserId && (
        <SupportConfirmation sessionId={sessionId} stripeUserId={user?.stripeUserId || ''} />
      )}
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Author));
