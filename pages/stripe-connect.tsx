import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Error from 'next/error';
import { useMutation } from '@apollo/react-hooks';

import { withApollo } from '../lib/apollo';
import { useAuth } from '../hooks/useAuth';

import ConnectStripeAccountMutation from '../queries/ConnectStripeAccountMutation';

import withLayout from '../components/withLayout';
import PageHeader from '../components/PageHeader';

const isAccountAlreadyConnectedError = (error: string): boolean => error.includes('authorization code has already been used');

const StripeConnect: NextPage = (): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const { code, state } = router.query;
  const [connectStripeAccount, { data, loading, called, error }] = useMutation(ConnectStripeAccountMutation);
  const accountAlreadyConnected = error && isAccountAlreadyConnectedError(error?.message);

  if (!auth.user?.uid || (!code && !state)) {
    return <div>Loading...</div>;
  }

  if (state !== auth.user.uid) {
    return <Error statusCode={404} />;
  }

  // Redirect to analytics if the user has already connected Stripe
  // Could happen if they refresh the page with an auth code
  if (accountAlreadyConnected) {
    router.push('/analytics');
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
        router.push('/analytics');
      }
    });
  }

  const { connectStripeAccount: stripeResults } = data || {};

  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      <PageHeader>
        Connecting with Stripe
      </PageHeader>

      {
        loading
        ? (
          <p>
            Talking to the wonderful folks at Stripe...
          </p>
        )
        : (
          <p>
            {
              stripeResults?.success || accountAlreadyConnected
                ? 'Looks like you\'re good to go!'
                : 'Something went wrong. Try again later and let us know if you keep having trouble.'
            }
          </p>
        )
      }
    </div>
  );
}

export default withApollo()(withLayout(StripeConnect));
