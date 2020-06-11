import { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { useInView } from 'react-intersection-observer';
import debounce from 'lodash/debounce';
import styled from '@emotion/styled';

import { Category, Article, ArticlesPayload } from '../generated/graphql';
import DiscoverArticlesQuery from '../queries/DiscoverArticlesQuery';

import { useAuth } from '../hooks/useAuth';
import useXOverflowGradient from '../hooks/useXOverflowGradient';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import DiscoverArticles from '../components/DiscoverArticles';
import Feed from '../components/Feed';
import GenericError from '../components/GenericError';
import DiscoverArticlesFallback from '../components/DiscoverArticlesFallback';

const categories = ['all'];
for (let category in Category) {
  category = category
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase();

  categories.push(category);
}

type ArticlesData = {
  articles: ArticlesPayload;
}

const OverflowLeftGradient = styled.div`
  background: linear-gradient(270deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
`;

const OverflowRightGradient = styled.div`
  background: linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
`;

function ArticlesContainer({
  articles = [],
  error,
  loading,
  category,
  cursor,
  fetchMore,
}: {
  articles: Article[];
  error: any;
  loading: boolean;
  category: string;
  cursor: string;
  fetchMore: (options: any) => any;
}): React.ReactElement {
  const [loadingMore, setLoadingMore] = useState(false);
  const [endOfCards, endOfCardsInView] = useInView();

  const debounceFetchMore = debounce(fetchMore, 2000, { leading: true });

  useEffect(() => {
    if (!loadingMore && endOfCardsInView && articles.length > 6) {
      setLoadingMore(true);

      debounceFetchMore({
        query: DiscoverArticlesQuery,
        variables: { category, cursor },
        updateQuery: ((
          previousResult: ArticlesData,
          { fetchMoreResult }: { fetchMoreResult: ArticlesData }
        ): ArticlesData => {
          setLoadingMore(false);

          const { articles: previousArticles } = previousResult as ArticlesData;
          const { articles: newArticles } = fetchMoreResult as ArticlesData;

          const uniqueArticles = new Map();
          previousArticles?.articles?.forEach(article => uniqueArticles.set(article?.id, article));
          newArticles?.articles?.forEach(article => uniqueArticles.set(article?.id, article));
          const articles = [...uniqueArticles.values()];
          const cursor = articles[articles.length - 1]?.id || null;

          return {
            articles: {
              articles,
              cursor,
              __typename: previousArticles.__typename,
            },
          }
        }),
      });
    }
  }, [endOfCardsInView]);

  if (error) return <div><GenericError title error={error} /></div>
  if (loading) return <DiscoverArticlesFallback />;

  return (
    <>
      <DiscoverArticles
        articles={articles}
        category={category}
      />

      <div  ref={endOfCards}></div>
    </>
  );
}

const Discover: NextPage = (): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(router?.query?.category as string || 'all');
  const { loading, data, error, fetchMore } = useQuery(DiscoverArticlesQuery, {
    variables: { category: selectedCategory },
  });

  const categoriesContainer = useRef<HTMLDivElement>(null);
  const [categoriesOverflowing, categoriesScrollEnd, categoriesScrollBegin] = useXOverflowGradient(categoriesContainer);

  if (auth.userId && categories[0] !== 'feed') {
    categories.unshift('feed');
  }

  const handleSelectCategory = (category: string): void => {
    window.analytics.track(`DISCOVER: ${category} clicked`);
    setSelectedCategory(category);
  }

  return (
    <div className="p-5">
      {
        !auth.userId && (
          <div className="text-center p-4 rounded -mt-1 mb-4 bg-primary text-white font-bold shadow-sm">
            <div>Welcome to Bard, a place where writers are supported by the readers.</div>
            <div>You have the power to support the writing you love. And writers get paid for it.</div>
          </div>
        )
      }

      <div className="relative w-5/6 mx-auto">
        <div
          className="flex w-full pb-5 space-x-8 overflow-x-scroll whitespace-no-wrap"
          ref={categoriesContainer}
        >
          {
            categories.map(category => {
              let classes = 'inline-block capitalize hover:cursor-pointer hover:text-primary font-medium';

              if (selectedCategory === category) {
                classes = `${classes} text-primary`;
              }

              return (
                <div
                  key={category}
                  className={classes}
                  onClick={(): void => {
                    handleSelectCategory(category);
                  }}
                >
                  {category}
                </div>
              );
            })
          }
        </div>

        {
          categoriesOverflowing && !categoriesScrollBegin && (
            <OverflowLeftGradient className="w-1/6 h-full absolute top-0 bottom-0 left-0 pointer-events-none" />
          )
        }

        {
          categoriesOverflowing && !categoriesScrollEnd && (
            <OverflowRightGradient className="w-1/6 h-full absolute top-0 bottom-0 right-0 pointer-events-none" />
          )
        }
      </div>
      {
        selectedCategory === 'feed'
          ? <Feed />
          : (
            <ArticlesContainer
              error={error}
              loading={loading}
              articles={data?.articles?.articles}
              category={selectedCategory}
              cursor={data?.articles?.cursor}
              fetchMore={fetchMore}
            />
          )
      }
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Discover));
