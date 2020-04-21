import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import { User } from '../generated/graphql';
import CreateStripeSessionMutation from '../queries/CreateStripeSessionMutation';

import Button from './Button';
import Modal from './Modal';

type FormData = {
  donationAmount: number;
};

function OneTimeSupportButton({
  stripeUserId,
  author,
}: {
  stripeUserId: string;
  author: User;
}): React.ReactElement {
  const router = useRouter();
  const auth = useAuth();

  const [displayDonationPrompt, setDisplayDonationPrompt] = useState(false);
  const { register, handleSubmit, errors } = useForm<FormData>();
  const [createStripeSession, { data, error, loading }] = useMutation(CreateStripeSessionMutation);

  const trackingData = {
    author: {
      id: author.id,
    },
    page: router.asPath,
  };

  const handleClick = (): void => {
    if (!auth.userId) {
      window.analytics.track('ONE TIME SUPPORT BUTTON: One-Time Support clicked; Redirect to login', trackingData);
      router.push(`/login?redirect=${router.asPath}`);
      return;
    }

    window.analytics.track('ONE TIME SUPPORT BUTTON: One-Time Support clicked', trackingData);

    setDisplayDonationPrompt(true);
  }

  const onSubmit = ({ donationAmount }: FormData): void => {
    window.analytics.track('ONE TIME SUPPORT BUTTON: Pay now clicked', { ...trackingData, donationAmount });

    createStripeSession({
      variables: {
        input: {
          stripeUserId,
          amount: +donationAmount,
          redirectUrl: `${window.location.origin}/${router.query.username}`,
        },
      },
    });
  }

  const redirectToCheckout = async ({ id: sessionId }: { id: string }): Promise<void> => {
    const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || '', {
      stripeAccount: stripeUserId,
    });

    if (stripe) {
      await stripe.redirectToCheckout({ sessionId });
    }
  }

  const { createStripeSession: stripeSessionData } = data || {};
  if (stripeSessionData) {
    redirectToCheckout(stripeSessionData);
  }

  return (
    <>
      <Button secondary onClick={handleClick}>
        One-Time Support
      </Button>

      <Modal open={displayDonationPrompt} onModalClose={(): void => setDisplayDonationPrompt(false)}>
        <h2 className="text-xl font-bold mb-2">Thank you!</h2>

        <p className="mb-4">
          Supporting {author.firstName} helps them focus on what matters most, their content.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="donationAmount" className="hidden">
              Donation amount
            </label>
            
            <input
              className={`border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.donationAmount && 'focus:border-primary'} placeholder-gray-500 ${errors.donationAmount && 'border-red-600'}`}
              id="donationAmount"
              type="number"
              name="donationAmount"
              placeholder="Enter a donation amount of $2 or more"
              ref={register({
                required: 'Please enter a donation amount',
                min: {
                  value: 2,
                  message: 'The minimum donation is $2',
                },
                max: {
                  value: 999999,
                  message: 'The maximum donation is $999,999',
                }
              })}
            />
            <span className="text-xs font-bold text-red-600">
              {errors.donationAmount && errors.donationAmount.message}
              {error && 'Yikes, something went wrong. Please try again in a minute.'}
            </span>
          </div>

          <div className="flex items-center md:justify-between justify-center">
            <Button className="w-full md:w-auto" loading={loading}>
              Pay now
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default OneTimeSupportButton;
