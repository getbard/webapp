import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import withLayout from '../components/withLayout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';

const EarnMoney: NextPage = (): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();

  if (!auth.user?.uid) {
    return <div>Loading...</div>;
  }

  const bardRedirectUrl = 'https://connect.stripe.com/connect/default/oauth/test';
  const clientId = 'ca_GzNbMg8V3fhQJyJOMKriQFdiUAjUPBaR';
  const userEmail = `stripe_user[email]=${auth.user.email}`;
  const stripeRedictUrl = `//connect.stripe.com/express/oauth/authorize?redirect_uri=${bardRedirectUrl}&client_id=${clientId}&state=${auth.user.uid}&stripe_user[business_type]=individual&${userEmail}`;

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

export default withLayout(EarnMoney);
