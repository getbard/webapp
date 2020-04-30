import { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { format } from 'date-fns';
import { ApolloError } from 'apollo-client';
import { NextSeo } from 'next-seo';
import styled from '@emotion/styled';

import { Article, User, ProfileSection } from '../generated/graphql';
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
import BardError from './_error';
import ProfileSectionDisplay from '../components/ProfileSectionDisplay';


type BorderHackProps = {
  width: number | undefined;
}

const BorderHack = styled.div`
  width: ${(props: BorderHackProps): string => props?.width ? props.width.toString() + 'px' : '100%'};
`;

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
  const querySection = router?.query?.section as string;
  const [section, setSection] = useState(querySection || 'articles');
  const [sectionContent, setSectionContent] = useState<ProfileSection | null>(null);
  const { loading, error, data } = useQuery(AuthorProfileQuery, { variables: { username } });
  const sectionsContainer = useRef<HTMLDivElement>(null);
  const [sectionsOverflowing, setSectionsOverflowing] = useState(false);

  useEffect(() => {
    if (sectionsContainer?.current) {
      const isOverflowing = sectionsContainer.current.scrollWidth > sectionsContainer.current.clientWidth;

      if (sectionsOverflowing !== isOverflowing) {
        setSectionsOverflowing(isOverflowing);
      }
    }
  }, [data?.user?.profileSections?.length]);

  useEffect(() => {
    if (section !== 'articles' && section !== 'activity') {
      const selectedSection = data?.user?.profileSections
        .find((profileSection: ProfileSection) => profileSection.title.toLowerCase() === section.toLowerCase());

      if (sectionContent?.id !== selectedSection?.id) {
        setSectionContent(selectedSection);
      }
    }
  }, [section]);

  if (loading) return <UserProfileFallback />;
  if (error?.message.includes('User not found'))return <BardError statusCode={404} hasGetInitialPropsRun={true} err={null} />;
  if (error) return <div><GenericError title /></div>;

  const { user }: { user: User } = data;

  if (!user?.id) {
    return <BardError statusCode={404} hasGetInitialPropsRun={true} err={null} />;
  }

  const {
    loading: articlesLoading,
    error: articlesError,
    data: articlesData,
    refetch,
  } = useQuery(ArticlesSummaryQuery, { variables: { userId: user.id } });

  const handleAddSectionClick = (): void => {
    window.analytics.track('AUTHOR PAGE: Add profile section clicked');
    router.push('/section');
  }

  return (
    <>
      <NextSeo
        title={`${user?.firstName} ${user?.lastName}` || user.username}
        description={`Read and support ${user.firstName} on Bard.`}
      />

      <div className="px-5 pt-5 grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-5">
        <div className="text-center break-words mb-10">
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
                {user?.stripeUserId && user?.stripePlan && (
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

        <div className="col-span-3 relative">
          <div
            className="mb-2 relative w-full overflow-x-scroll"
            ref={sectionsContainer}
          >
            <div className="space-x-8">
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

              {
                user?.profileSections?.length
                  ? (
                    <div className="inline whitespace-no-wrap space-x-8">
                      {user.profileSections.map(profileSection => (
                        <ProfileSectionSelector
                          key={profileSection?.id}
                          name={profileSection?.title || ''}
                          setSection={setSection}
                          section={section.toLowerCase()}
                        />
                      ))}
                    </div>
                  )
                  : ''
              }

              {
                user.id === auth.userId && (
                  <div
                    title="Add profile section"
                    className="inline text-2xl text-gray-500 hover:text-primary hover:cursor-pointer"
                    onClick={handleAddSectionClick}
                  >
                    +
                  </div>
                )
              }

              {
                sectionsOverflowing && (
                  <div
                    className="absolute mt-8 top-0 right-0 text-xs text-gray-300"
                    title="Scroll for more sections"
                  >
                    more sections &gt;
                  </div>
                )
              }
            </div>

            <BorderHack
              width={sectionsContainer?.current?.scrollWidth}
              className="m-0 pt-4 border-b-2 border-gray-300 bottom-0"
            ></BorderHack>
          </div>

          {
            section === 'articles' && (
              <Articles
                name={user.firstName}
                loading={articlesLoading}
                error={articlesError}
                articlesData={articlesData}
                refetch={refetch}
              />
            )
          }

          {
            section === 'activity' && (
              <ProfileFeed
                userId={user.id}
                name={user.firstName}
              />
            )
          }

          {
            section !== 'articles' && section !== 'activity' && sectionContent && (
              <ProfileSectionDisplay
                key={sectionContent.id}
                section={sectionContent}
                user={user}
                onDelete={(): void => {
                  setSection('articles');
                }}
              />
            )
          }
        </div>

        {sessionId && user?.stripeUserId && (
          <SupportConfirmation
            authorId={user.id}
            sessionId={sessionId}
            stripeUserId={user?.stripeUserId || ''}
          />
        )}
      </div>
    </>
  );
}

export default withApollo({ ssr: true })(withLayout(Author));
