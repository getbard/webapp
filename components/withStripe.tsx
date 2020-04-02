import { NextPage } from 'next';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

function withStripe(PageComponent: NextPage): NextPage {
  const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || '');

  const PageComponentWithStripe = (): React.ReactElement => {
    return (
      <Elements stripe={stripePromise}>
        <PageComponent />
      </Elements>
    );
  }

  return PageComponentWithStripe;
}

export default withStripe;
