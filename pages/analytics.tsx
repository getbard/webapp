import { NextPage } from 'next';

import { withApollo } from '../lib/apollo';

import withLayout from '../components/withLayout';
import PageHeader from '../components/PageHeader';

const Analytics: NextPage = (): React.ReactElement => {
  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      <PageHeader>
        Your article performance
      </PageHeader>

      You&apos;ll see data for your articles once we crunch some numbers.
    </div>
  );
}

export default withApollo()(withLayout(Analytics));
