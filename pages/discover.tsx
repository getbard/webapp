import { NextPage } from 'next';
import { withApollo } from '../lib/apollo';

import DiscoverArticles from '../components/DiscoverArticles';

const Discover: NextPage = (): React.ReactElement => {
  return (
    <div className="px-5 pt-5">
      <div className="mb-10">
        <h1 className="text-4xl font-serif font-bold">
          Discover
        </h1>
      </div>

      <DiscoverArticles />
    </div>
  );
}

export default withApollo({ ssr: true })(Discover);
