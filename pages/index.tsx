import { NextPage } from 'next';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import DiscoverArticles from '../components/DiscoverArticles';

const Discover: NextPage = (): React.ReactElement => {
  return (
    <div className="px-5 pt-5">
      <h1 className="text-4xl font-serif font-bold">
        Discover
      </h1>

      <DiscoverArticles />
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Discover));
