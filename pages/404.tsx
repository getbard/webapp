import { NextPage } from 'next';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import withLayout from '../components/withLayout';

const Custom404: NextPage = (): React.ReactElement => {
  return (
    <>
      <NextSeo
        title="404"
        description="We couldn't find what you were looking for."
      />

      <div className="flex justify-center items-center flex-col p-40 text-lg">
        <div className="text-4xl text-center font-serif">
          <div>
            Not all those who wander are lost.
          </div>
        </div>

        <div>
          J.R.R. Tolkien was right. And we couldn&apos;t find what you were looking for.
        </div>

        <Link href="/">
          <a className="underline">
            Find your way home
          </a>
        </Link>
      </div>
    </>
  );
}

export default withLayout(Custom404);
