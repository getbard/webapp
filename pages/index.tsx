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

const OverflowGradient = styled.div`
  background: linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
`;

function ArticlesContainer({
  articlesWithHeader = [],
  articlesWithoutHeader = [],
  error,
  loading,
  category,
  headerCursor,
  headlessCursor,
  fetchMore,
}: {
  articlesWithHeader: Article[];
  articlesWithoutHeader: Article[];
  error: any;
  loading: boolean;
  category: string;
  headerCursor: string;
  headlessCursor: string;
  fetchMore: (options: any) => any;
}): React.ReactElement {
  const [loadingMore, setLoadingMore] = useState(false);
  const [endOfCards, endOfCardsInView] = useInView();

  const debounceFetchMore = debounce(fetchMore, 2000, { leading: true });

  useEffect(() => {
    if (!loadingMore && endOfCardsInView && articlesWithHeader.length > 6) {
      setLoadingMore(true);

      debounceFetchMore({
        query: DiscoverArticlesQuery,
        variables: { category, headerCursor, headlessCursor },
        updateQuery: ((
          previousResult: ArticlesData,
          { fetchMoreResult }: { fetchMoreResult: ArticlesData }
        ): ArticlesData => {
          setLoadingMore(false);

          const { articles: previousArticles } = previousResult as ArticlesData;
          const { articles: newArticles } = fetchMoreResult as ArticlesData;

          const uniqueArticlesWithHeader = new Map();
          previousArticles?.articlesWithHeader?.forEach(article => uniqueArticlesWithHeader.set(article?.id, article));
          newArticles?.articlesWithHeader?.forEach(article => uniqueArticlesWithHeader.set(article?.id, article));
          const articlesWithHeader = [...uniqueArticlesWithHeader.values()];
          const headerCursor = articlesWithHeader[articlesWithHeader.length - 1]?.id || null;
  
          const uniqueArticlesWithoutHeader = new Map();
          previousArticles?.articlesWithoutHeader?.forEach(article => uniqueArticlesWithoutHeader.set(article?.id, article));
          newArticles?.articlesWithoutHeader?.forEach(article => uniqueArticlesWithoutHeader.set(article?.id, article));
          const articlesWithoutHeader = [...uniqueArticlesWithoutHeader.values()];
          const headlessCursor = articlesWithoutHeader[articlesWithoutHeader.length - 1]?.id || null;

          return {
            articles: {
              articlesWithHeader,
              articlesWithoutHeader,
              headerCursor,
              headlessCursor,
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
        articlesWithHeader={articlesWithHeader}
        articlesWithoutHeader={articlesWithoutHeader}
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
  const [categoriesOverflowing, categoriesScrollEnd] = useXOverflowGradient(categoriesContainer);

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

      <div className="relative">
        <div
          className={`${categoriesOverflowing ? '' : 'justify-center'} flex w-full pb-5 space-x-4 overflow-x-scroll whitespace-no-wrap`}
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
          categoriesOverflowing && !categoriesScrollEnd && (
            <OverflowGradient className="w-1/6 h-full absolute top-0 bottom-0 right-0 pointer-events-none" />
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
              articlesWithHeader={data?.articles?.articlesWithHeader}
              articlesWithoutHeader={data?.articles?.articlesWithoutHeader}
              category={selectedCategory}
              headerCursor={data?.articles?.headerCursor}
              headlessCursor={data?.articles?.headlessCursor}
              fetchMore={fetchMore}
            />
          )
      }
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Discover));
