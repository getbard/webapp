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

function DonationCard({
  donationAmount,
  text,
  onSubmit,
}: {
  donationAmount: number;
  text: string;
  onSubmit: (data: FormData) => void;
}): React.ReactElement {
  return (
    <div className="p-10 border border-gray-300 rounded-sm flex flex-col justify-center items-center">
      <div className="text-5xl font-serif font-bold text-primary">
        ${donationAmount}
      </div>

      <div className="mb-4">
        {text}
      </div>

      <Button
        className="w-full md:w-auto"
        onClick={(): void => {
          window.analytics.track('PRESET DONATION CARD: Donate clicked', { donationAmount });
          onSubmit({ donationAmount });
        }}
      >
        Donate
      </Button>
    </div>
  );
}

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
  const [displayCustomAmount, setDisplayCustomAmount] = useState(false);

  const trackingData = {
    authorId: author.id,
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
          authorId: author.id,
          stripeUserId,
          amount: +donationAmount,
          redirectUrl: `${window.location.origin}${router.asPath}`,
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
        One-Time Donation
      </Button>

      <Modal open={displayDonationPrompt} onModalClose={(): void => setDisplayDonationPrompt(false)}>
        <h2 className="text-xl font-bold mb-2">Thank you!</h2>

        <p className="mb-4">
          Donating to {author.firstName} helps them focus on what matters most, their content.
        </p>

        <div className="mb-4 grid grid-cols-3 gap-4">
          <DonationCard
            donationAmount={2}
            text="Less than your average Starbucks order!"
            onSubmit={onSubmit}
          />

          <DonationCard
            donationAmount={5}
            text="Less than your average restaurant order!"
            onSubmit={onSubmit}
          />

          <DonationCard
            donationAmount={10}
            text="Less than a movie date for two!"
            onSubmit={onSubmit}
          />
        </div>

        {
          displayCustomAmount
            ? (
              <form onSubmit={handleSubmit(onSubmit)} className="p-10 border border-gray-300 rounded-sm flex flex-col justify-center items-center">
                <div className="mb-4 font-serif text-5xl text-primary text-center">
                  <label htmlFor="donationAmount" className="hidden">
                    Donation amount
                  </label>
                  
                  $

                  <input
                    className={`w-1/2 px-2 border rounded-sm focus:outline-none ${!errors.donationAmount && 'focus:border-primary'} placeholder-gray-500 ${errors.donationAmount && 'border-red-600'}`}
                    id="donationAmount"
                    type="number"
                    name="donationAmount"
                    placeholder="100"
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

                <div className="mb-4">
                  Set your own price with a minimum donation of $2.
                </div>

                <div className="flex items-center md:justify-between justify-center">
                  <Button className="w-full md:w-auto" loading={loading}>
                    Donate
                  </Button>
                </div>
              </form>
            )
            : (
              <div
                className="text-center hover:cursor-pointer -mb-4"
                onClick={(): void => setDisplayCustomAmount(true)}
              >
                Set your own amount
              </div>
            )
        }
      </Modal>
    </>
  );
}

export default OneTimeSupportButton;
