import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { loadStripe } from '@stripe/stripe-js';
import { FiFeather } from 'react-icons/fi';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import { User } from '../generated/graphql';
import CreateStripeSessionMutation from '../queries/CreateStripeSessionMutation';
import UserSupportQuery from '../queries/UserSupportQuery';

import { formatAmountForDisplay } from '../lib/stripe';
import Button from './Button';
import Modal from './Modal';

function BecomeSupporterButton({
  author,
  displayModal,
}: {
  author: User;
  displayModal?: boolean;
}): React.ReactElement {
  const router = useRouter();
  const auth = useAuth();

  const { stripeUserId, stripePlan, firstName } = author;
  const [displayDonationPrompt, setDisplayDonationPrompt] = useState(displayModal || false);
  const [createStripeSession, { data, error, loading }] = useMutation(CreateStripeSessionMutation);
  const { data: userSupportData } = useQuery(UserSupportQuery, { variables: { username: author.username }});
  const subscribers = userSupportData?.user?.subscribers || [];

  const trackingData = {
    author: {
      id: author.id,
    },
    page: router.asPath,
  };

  const handleClick = (): void => {
    if (!auth.userId) {
      window.analytics.track('BECOME SUPPORTER BUTTON: Become a support clicked; Redirect to login', trackingData);
      router.push(`/login?redirect=${router.asPath}`);
      return;
    }

    window.analytics.track('BECOME SUPPORTER BUTTON: Become a support clicked', trackingData);

    setDisplayDonationPrompt(true);
  }

  const handleSubmit = (): void => {
    window.analytics.track('BECOME SUPPORTER BUTTON: Start supporting today clicked', trackingData);

    createStripeSession({
      variables: {
        input: {
          authorId: author.id,
          stripeUserId,
          plan: { ...stripePlan, __typename: undefined },
          redirectUrl: `${window.location.origin}${window.location.pathname}`,
        },
      },
    });
  }

  const redirectToCheckout = async ({ id: sessionId }: { id: string }): Promise<void> => {
    const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || '', {
      stripeAccount: stripeUserId || '',
    });
    
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId });
    }
  }

  const { createStripeSession: stripeSessionData } = data || {};
  if (stripeSessionData) {
    redirectToCheckout(stripeSessionData);
  }

  const isSubscriber = subscribers?.some((subscriber: string) => subscriber === auth?.userId);

  return (
    <>
      {
        isSubscriber
          ? (
            <span className="font-bold">
              Thanks for being a supporter!
            </span>
          )
          : (
            <>
              <Button onClick={handleClick}>
                Become a supporter
              </Button>
        
              <Modal
                open={displayDonationPrompt}
                onModalClose={(): void => {
                  window.analytics.track('BECOME SUPPORTER BUTTON: Modal closed');
                  setDisplayDonationPrompt(false);
                }}
              >
                <div>
                  <h2 className="text-xl font-bold mb-2">Thank you!</h2>
        
                  <p className="mb-4">
                    Supporting {firstName} every {stripePlan?.interval} will help them focus on what matters most, their content.
                  </p>
        
                  <p className="mb-4">
                    Supporting an author monthly unlocks subscriber only content (<span className="text-primary"><FiFeather className="inline-block" /></span>).
                  </p>
        
                  <p className="mb-4">
                    You will be paying <span className="font-bold text-primary">{formatAmountForDisplay(stripePlan?.amount! || 1000)} {stripePlan?.currency.toUpperCase() || 'USD'} per {stripePlan?.interval || 'month'}</span>.
                  </p>
        
                  {error && (
                    <p className="text-xs font-bold text-red-600 mb-4">
                      Yikes, something went wrong. Please try again in a minute.
                    </p>
                  )}
        
                  <div className="flex items-center md:justify-between justify-center">
                    <Button className="w-full md:w-auto" loading={loading} onClick={handleSubmit}>
                      Start supporting today
                    </Button>
                  </div>
                </div>
              </Modal>
            </>
          )
      }
    </>
  );
}

export default BecomeSupporterButton;
