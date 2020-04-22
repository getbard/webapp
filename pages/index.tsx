import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';

import { Category, Article } from '../generated/graphql';
import DiscoverArticlesQuery from '../queries/DiscoverArticlesQuery';

import { useAuth } from '../hooks/useAuth';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import DiscoverArticles from '../components/DiscoverArticles';
import Feed from '../components/Feed';
import GenericError from '../components/GenericError';
import DiscoverArticlesFallback from '../components/DiscoverArticlesFallback';
import CategoryDropdown from '../components/CategoryDropdown';

const defaultCategories = ['all'];
for (const category in Category) {
  if (defaultCategories.length !== 11) {
    defaultCategories.push(category);
  }
}

function ArticlesContainer({
  articles = [],
  error,
  loading,
  category,
}: {
  articles: Article[];
  error: any;
  loading: boolean;
  category: string;
}): React.ReactElement {
  if (error) return <div><GenericError title /></div>
  if (loading) return <DiscoverArticlesFallback />;

  return (
    <DiscoverArticles
      articles={articles}
      category={category}
    />
  );
}

const Discover: NextPage = (): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(router?.query?.category as string || 'all');
  const [hasSetCategories, setHasSetCategories] = useState(false);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const { loading, data, error, refetch } = useQuery(DiscoverArticlesQuery, {
    variables: { category: selectedCategory },
  });

  useEffect(() => {
    refetch({
      category: selectedCategory,
    });
  }, [selectedCategory]);

  useEffect(() => {
    if (hasSetCategories) {
      return;
    }

    const articles = data?.articles || [];
  
    const categoryCounter = new Map();
  
    articles.forEach((article: Article) => {
      if (article.category) {
        const category = article.category;

        if (categoryCounter.has(category)) {
          categoryCounter.set(category, categoryCounter.get(category));
        } else if (categoryCounter.size !== 10) {
          categoryCounter.set(category, 1);
        }
      }
    });

    for (const category in Category) {
      if (!categoryCounter.has(category.toLowerCase()) && categoryCounter.size !== 10) {
        categoryCounter.set(category.toLowerCase(), 0);
      }
    }
  
    const newCategories = [...categoryCounter.keys()];
    newCategories.sort((a, b) => {
      if (a > b) {
        return 1;
      }

      if (a < b) {
        return -1;
      }

      return 0;
    });
  
    newCategories.unshift('all');

    setCategories(newCategories);
    setHasSetCategories(true);
  }, [data?.articles.length]);

  if (auth.userId && categories[0] !== 'feed') {
    categories.unshift('feed');
  }

  const handleSelectCategory = (category: string): void => {
    window.analytics.track(`DISCOVER: ${category} clicked`);
    setSelectedCategory(category);
  }

  return (
    <div className="px-5 pt-5">
      <div className="hidden md:block w-full px-5 pb-5 text-center">
        {
          categories.map(category => {
            let classes = 'inline-block capitalize mx-4 text-center hover:cursor-pointer hover:text-primary font-medium';

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
        <div className="md:hidden pb-5 text-center">
          <div
            className="inline-block capitalize mx-4 text-center hover:cursor-pointer hover:text-primary font-medium"
            onClick={(): void => handleSelectCategory('feed')}
          >
            feed
          </div>

          <CategoryDropdown
            categories={categories.length === 12 ? categories.slice(1) : categories}
            category={selectedCategory}
            setCategory={handleSelectCategory}
          />
        </div>
      }

      {
        selectedCategory === 'feed'
          ? <Feed />
          : (
            <ArticlesContainer
              error={error}
              loading={loading}
              articles={data?.articles}
              category={selectedCategory}
            />
          )
      }
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Discover));
