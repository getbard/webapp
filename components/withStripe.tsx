import { NextPage } from 'next';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || '');

function withStripe(PageComponent: NextPage): NextPage {
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
