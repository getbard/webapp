import { useState } from 'react';
import { NextPage } from 'next';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { format, formatDistanceToNow } from 'date-fns';

import { Article } from '../../generated/graphql';
import ArticlesAnalyticsQuery from '../../queries/ArticlesAnalyticsQuery';
import UserAnalyticsQuery from '../../queries/UserAnalyticsQuery';

import { useAuth } from '../../hooks/useAuth';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import ArticleAnalyticsRow from '../../components/ArticleAnalyticsRow';
import PageHeader from '../../components/PageHeader';
import ArticlesAnalyticsFallback from '../../components/ArticlesAnalyticsFallback';
import EmptyState from '../../components/EmptyState';
import GenericError from '../../components/GenericError';

const famousBookLengths = [
  { title: 'The Philosopher’s Stone', wordCount: 77325 },
  { title: 'The Hobbit', wordCount: 95022 },
  { title: 'The Lord of the Rings', wordCount: 455125 },
  { title: 'Charlie and the Chocolate Factory', wordCount: 30644 },
  { title: 'Lion The Witch and the Wardrobe', wordCount: 36363 },
  { title: 'Fahrenheit 451', wordCount: 46118 },
  { title: 'Lord of the Flies', wordCount: 59900 },
  { title: 'Walden', wordCount: 114634 },
  { title: 'Twilight', wordCount: 118975 },
  { title: 'Hamlet', wordCount: 30066 },
  { title: 'Pride and Prejudice', wordCount: 122685 },
];

const famousBook = famousBookLengths[Math.floor(Math.random() * famousBookLengths.length)];

function DisplayArticleAnalytics(): React.ReactElement {
  const auth = useAuth();
  const [sortBy, setSortBy] = useState('latest');
  const userId = auth.userId || auth.user?.uid;

  const {
    loading: articleAnalyticsLoading,
    error: articleAnalyticsError,
    data: articleAnalyticsData,
  } = useQuery(ArticlesAnalyticsQuery, {
    variables: { userId, drafts: true },
  });

  const {
    loading: userAnalyticsLoading,
    error: userAnalyticsError,
    data: userAnalyticsData,
  } = useQuery(UserAnalyticsQuery, {
    variables: { username: 'me' },
  });

  if (articleAnalyticsLoading || userAnalyticsLoading) return <ArticlesAnalyticsFallback />;
  if (articleAnalyticsError || userAnalyticsError) return <div><GenericError title error={articleAnalyticsError || userAnalyticsError} /></div>;

  const { articlesByUser } = articleAnalyticsData;
  const analytics = userAnalyticsData?.user?.analytics || null;

  if (!articlesByUser.length) {
    return (
      <EmptyState title="Ready to share your thoughts?">
        <div>
          You don&apos;t have any published articles.
        </div>

        <Link href="/write">
          <a
            className="underline"
            onClick={(): void => window.analytics.track('ANALYTICS: Write one today! clicked')}
          >
            Write one today!
          </a>
        </Link>
      </EmptyState>
    );
  }

  const totalViews = articlesByUser.reduce((a: number, b: Article) => a + (b?.analytics?.totalViews || 0), 0);
  const totalReads = articlesByUser.reduce((a: number, b: Article) => a + (b?.analytics?.totalReads || 0), 0);

  const changeSort = (): void => {
    window.analytics.track('ANALYTICS: Change sort clicked', { sortBy });
    setSortBy(sortBy === 'latest' ? 'popular' : 'latest');
  }

  const joinDate = new Date(analytics.joinDate);
  const percentageOfFamousNovel = ((analytics.wordsWritten / famousBook.wordCount) * 100).toFixed(2);

  return (
    <div>
      <div className="mb-4 text-lg">
        <p>
          You&apos;ve been apart of Bard since {format(joinDate, 'LLLL d, yyyy')}. That was {formatDistanceToNow(joinDate)} ago.
        </p>
        
        {
          analytics.wordsWritten > 0 && (
            <p>
              During that time you have written <span className="font-bold">{analytics.wordsWritten} words</span> on the platform! That&apos;s {percentageOfFamousNovel}% of {famousBook.title}.
            </p>
          )
        }
      </div>

      <div className="md:flex items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <div className="p-10 w-1/3 bg-gray-50 rounded-sm w-full">
          <div className="text-6xl font-serif text-primary">
            {articlesByUser.length}
          </div>

          <div className="text-lg text-gray-600">
            Published articles
          </div>
        </div>
        
        <div className="p-10 w-1/3 bg-gray-50 rounded-sm w-full">
          <div className="text-6xl font-serif text-primary">
            {totalViews}
          </div>

          <div className="text-lg text-gray-600">
            Total views
          </div>
        </div>
        
        <div className="p-10 w-1/3 bg-gray-50 rounded-sm w-full">
          <div className="text-6xl font-serif text-primary">
            {totalReads}
          </div>

          <div className="text-lg text-gray-600">
            Total reads
          </div>
        </div>
      </div>

      <div className="md:flex items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <div className="p-10 w-1/3 bg-gray-50 rounded-sm w-full">
          <div className="text-6xl font-serif text-primary">
            {analytics.subscriberCount}
          </div>

          <div className="text-lg text-gray-600">
            Subscribers
          </div>
        </div>
        
        <div className="p-10 w-1/3 bg-gray-50 rounded-sm w-full">
          <div className="text-6xl font-serif text-primary">
            {analytics.followerCount}
          </div>

          <div className="text-lg text-gray-600">
            Followers
          </div>
        </div>
      </div>

      <div className="text-xs">
        Showing <span className="underline hover:text-primary hover:cursor-pointer" onClick={changeSort}>
          {sortBy}
        </span> articles first
      </div>

      {articlesByUser.sort((a: Article, b: Article) => {
        const aDate = new Date(a.publishedAt || a.createdAt);
        const bDate = new Date(b.publishedAt || b.createdAt);

        if (sortBy === 'latest') {
          return bDate.getTime() - aDate.getTime();
        } else {
          const aPopularity = (a?.analytics?.totalReads || 0) + (a?.analytics?.totalViews || 0) + (a?.analytics?.totalComments || 0);
          const bPopularity = (b?.analytics?.totalReads || 0) + (b?.analytics?.totalViews || 0) + (b?.analytics?.totalComments || 0);

          return bPopularity - aPopularity;
        }
      }).map((article: Article) => {
        return <ArticleAnalyticsRow key={article.id} article={article} />;
      })}
    </div>
  )
}

const Analytics: NextPage = (): React.ReactElement => {
  return (
    <div className="px-5 pt-5 container mx-auto relative">
      <NextSeo
        title="Articles"
        description="Get a glimpse at everything you've written."
      />

      <PageHeader>
        Analytics
      </PageHeader>

      <DisplayArticleAnalytics />
    </div>
  );
}

export default withApollo()(withLayout(Analytics));
