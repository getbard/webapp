import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';

import { withApollo } from '../lib/apollo';
import { useAuth } from '../hooks/useAuth';

import StripeUserIdQuery from '../queries/StripeUserIdQuery';

import withLayout from '../components/withLayout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import GenericLoader from '../components/GenericLoader';

const EarnMoney: NextPage = (): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const { loading, data } = useQuery(StripeUserIdQuery, { variables: { username: 'me' }});

  if (!auth.user?.uid || loading) {
    return <GenericLoader />;
  }

  const { user } = data || {};
  if (user?.stripeUserId) {
    router.push('/analytics');
  }

  const bardRedirectUrl = `${window.location.origin}/stripe-connect`;
  const clientId = process.env.STRIPE_CLIENT_ID;
  const userEmail = `stripe_user[email]=${auth?.user?.email}`;
  const stripeRedictUrl = `//connect.stripe.com/express/oauth/authorize?redirect_uri=${bardRedirectUrl}&client_id=${clientId}&state=${auth?.user?.uid}&stripe_user[business_type]=individual&${userEmail}&suggested_capabilities[]=card_payments&suggested_capabilities[]=transfers`;

  const handleClick = (): void => {
    router.push(stripeRedictUrl);
  }

  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      <PageHeader>
        Earn money with your words
      </PageHeader>

      <p className="mb-4">
        With a premium author account, you can accept donations and subscriptions. You&apos;ll be able to restrict articles to your subscribers, reach out to fans directly, and more.
      </p>

      <p className="mb-6">
        Bard partners with Stripe for fast, secure payments. We just need a few more details.
      </p>

      <Button onClick={handleClick}>
        Start Earning
      </Button>
    </div>
  );
}

export default withApollo()(withLayout(EarnMoney));
