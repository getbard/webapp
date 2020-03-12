import { NextPage } from 'next';

import DiscoverArticles from '../components/DiscoverArticles';

const Discover: NextPage = (): React.ReactElement => {
  return (
    <div className="px-5 pt-5">
      <div className="border-b border-black mb-10">
        <h1 className="text-5xl font-serif">
          discover
        </h1>
      </div>

      <DiscoverArticles />
    </div>
  );
}

export default Discover;
