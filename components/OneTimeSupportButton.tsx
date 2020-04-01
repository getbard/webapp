import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';

import CreateStripeSessionMutation from '../queries/CreateStripeSessionMutation';

import Button from './Button';
import Portal from './Portal';

type FormData = {
  donationAmount: number;
};

function OneTimeSupportButton(): React.ReactElement {
  const [displayDonationPrompt, setDisplayDonationPrompt] = useState(false);
  const { register, handleSubmit, errors } = useForm<FormData>();
  const [createStripeSession, { data, called, error, loading }] = useMutation(CreateStripeSessionMutation);
  const stripe = useStripe();
  const router = useRouter();

  const onSubmit = ({ donationAmount }: FormData): void => {
    createStripeSession({
      variables: {
        input: {
          amount: +donationAmount,
          redirectUrl: `${window.location.origin}/${router.query.username}`,
        },
      },
    });
  }

  const redirectToCheckout = async ({ id: sessionId }: { id: string }): Promise<void> => {
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
      <Button secondary onClick={(): void => setDisplayDonationPrompt(true)}>
        One-Time Support
      </Button>

      {
        displayDonationPrompt && (
          <Portal selector="body">
            <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
              <div className="p-10 bg-white border border-primary rounded-sm max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <label htmlFor="donationAmount">
                      Donation Amount
                    </label>

                    <input
                      className={`border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.donationAmount && 'focus:border-primary'} placeholder-gray-400 ${errors.donationAmount && 'border-red-600'}`}
                      id="donationAmount"
                      type="number"
                      name="donationAmount"
                      placeholder="Enter an amount greater than $5"
                      ref={register({
                        required: 'Please enter a donation amount',
                        min: {
                          value: 5,
                          message: 'The minimum donation is $5',
                        },
                      })}
                    />
                    <span className="tracking-wide text-primary text-xs font-bold">
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
              </div>
            </div>
          </Portal>
        )
      }
    </>
  );
}

export default OneTimeSupportButton;
