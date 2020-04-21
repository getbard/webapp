import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Category, Article } from '../generated/graphql';

import { useAuth } from '../hooks/useAuth';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import DiscoverArticles from '../components/DiscoverArticles';
import Feed from '../components/Feed';

const Discover: NextPage = (): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(router?.query?.category as string || 'all');

  const categories = ['all'];
  for (const category in Category) {
    if (categories.length !== 11) {
      categories.push(category);
    }
  }

  if (auth.userId) {
    categories.unshift('feed');
  }

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
            />
          )
      }
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Discover));
