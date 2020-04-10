import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Category } from '../generated/graphql';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import DiscoverArticles from '../components/DiscoverArticles';
import Feed from '../components/Feed';

const Discover: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(router?.query?.category as string || 'all');
  const categories = ['my feed', 'all'];
  for (const category in Category) {
    categories.push(category.toLowerCase());
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
                onClick={(): void => setSelectedCategory(category)}
              >
                {category}
              </div>
            );
          })
        }
      </div>

      {
        selectedCategory === 'my feed'
          ? <Feed />
          : <DiscoverArticles category={selectedCategory} />
      }
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Discover));
