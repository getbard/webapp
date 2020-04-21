import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Category, Article } from '../generated/graphql';

import { useAuth } from '../hooks/useAuth';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import DiscoverArticles from '../components/DiscoverArticles';
import Feed from '../components/Feed';

const defaultCategories = ['all'];
for (const category in Category) {
  if (defaultCategories.length !== 11) {
    defaultCategories.push(category);
  }
}

const Discover: NextPage = (): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(router?.query?.category as string || 'all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);

  useEffect(() => {
    const categoryCounter = new Map();

    articles.forEach((article: Article) => {
      if (article?.category) {
        if (categoryCounter.has(article.category)) {
          const currCount = categoryCounter.get(article.category);
          categoryCounter.set(article.category, currCount + 1);
        } else {
          categoryCounter.set(article.category, 1);
        }
      }
    });

    for (const category in Category) {
      const lowerCategory = category.toLowerCase();
      if (!categoryCounter.has(lowerCategory) && categoryCounter.size !== 10) {
        categoryCounter.set(lowerCategory, 0);
      }
    }

    const newCategories = [...categoryCounter.keys()];
    newCategories.sort((a, b) => parseInt(a) - parseInt(b));

    newCategories.unshift('all');

    if (auth.userId) {
      newCategories.unshift('feed');
    }

    setCategories(newCategories);
  }, [articles.length]);

  return (
    <div className="px-5 pt-5">
      <div className="w-full px-5 pb-5 text-center">
        {
          categories.map(category => {
            let classes = 'capitalize mx-4 inline-block text-center hover:cursor-pointer hover:text-primary font-medium';

            if (selectedCategory === category) {
              classes = `${classes} text-primary`;
            }

            return (
              <div
                key={category}
                className={classes}
                onClick={(): void => {
                  window.analytics.track(`DISCOVER: ${category} clicked`);
                  setSelectedCategory(category);
                }}
              >
                {category}
              </div>
            );
          })
        }
      </div>

      {
        selectedCategory === 'feed'
          ? <Feed />
          : (
            <DiscoverArticles
              category={selectedCategory}
              setArticles={setArticles}
            />
          )
      }
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Discover));
