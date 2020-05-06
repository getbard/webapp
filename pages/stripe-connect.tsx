import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Error from 'next/error';
import { useMutation } from '@apollo/react-hooks';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import { withApollo } from '../lib/apollo';
import { useAuth } from '../hooks/useAuth';

import ConnectStripeAccountMutation from '../queries/ConnectStripeAccountMutation';

import withLayout from '../components/withLayout';
import PageHeader from '../components/PageHeader';
import GenericLoader from '../components/GenericLoader';
import BardError from './_error';

const isAccountAlreadyConnectedError = (error: string): boolean => error.includes('authorization code has already been used');

const SuccessInfo = (): React.ReactElement => {
  window.analytics.track('STRIPE CONNECT: Success info displayed');

  return (
    <div>
      <p className="mb-4">Looks like you&apos;re good to go!</p>

      <p className="mb-4">Readers can now support you monthly for <strong className="text-primary">$10 USD / month</strong>.</p>

      <p>
        You can adjust this price <Link href="/settings"><a onClick={(): void => window.analytics.track('STRIPE CONNECT: Settings clicked')}>in your settings</a></Link> at any time.
      </p>
    </div>
  );
}

const StripeConnect: NextPage = (): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const { code, state } = router.query;
  const [connectStripeAccount, { data, loading, called, error }] = useMutation(ConnectStripeAccountMutation);
  const accountAlreadyConnected = error && isAccountAlreadyConnectedError(error?.message);

  if (!auth.user?.uid || (!code && !state) || loading) {
    return <GenericLoader />;
  }

  if (state !== auth.user.uid) {
    return <BardError statusCode={404} hasGetInitialPropsRun={true} err={null} />;
  }

  // Redirect to settings if the user has already connected Stripe
  // Could happen if they refresh the page with an auth code
  if (accountAlreadyConnected) {
    router.push('/settings');
  }

  if (!called) {
    connectStripeAccount({
      variables: {
        input: {
          authCode: code,
          userId: auth.user.uid,
        }
      }
    }).catch(error => {
      if (isAccountAlreadyConnectedError(error?.message)) {
        router.push('/settings');
      }
    });
  }

  const { connectStripeAccount: stripeResults } = data || {};

  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      <NextSeo
        title="Stripe"
        description="Connect with Stripe and earn money while writing."
      />

      <PageHeader>
        Connecting with Stripe
      </PageHeader>

      <p>
        {
          stripeResults?.success || accountAlreadyConnected
            ? <SuccessInfo />
            : 'Something went wrong. Try again later and let us know if you keep having trouble.'
        }
      </p>
    </div>
  );
}

export default withApollo()(withLayout(StripeConnect));
