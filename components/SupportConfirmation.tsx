import { useQuery } from '@apollo/react-hooks';

import StripeSessionQuery from '../queries/StripeSessionQuery';

import Modal from './Modal';

function SupportConfirmation({
  authorId,
  sessionId,
  stripeUserId,
  refetch,
}: {
  authorId: string;
  sessionId: string | string[];
  stripeUserId: string;
  refetch?: () => void;
}): React.ReactElement {
  const { loading, error, data } = useQuery(StripeSessionQuery, {
    variables: {
      id: sessionId,
      stripeUserId,
      authorId,
    }
  });
  const sessionSucceededOrSubscription = data?.stripeSession?.status === 'succeeded' || data?.stripeSession?.subscription;
  const supportConfirmationFailed = (error || (data?.stripeSession?.status !== 'succeeded' && !data?.stripeSession?.subscription))

  if (typeof window !== 'undefined') {
    if (sessionSucceededOrSubscription) {
      window.analytics.track('SUPPORT CONFIRMATION: Succeeded', { stripeUserId });
    }
  
    if (supportConfirmationFailed) {
      window.analytics.track('SUPPORT CONFIRMATION: Failed', {
        stripeUserId,
        error: {
          message: error?.message,
        }
      });
    }
  }

  if (sessionSucceededOrSubscription && refetch) {
    refetch();
  }

  return (
    <Modal open>
      <div>
        {loading && <div>Confirming your payment with Stripe...</div>}
        {supportConfirmationFailed && <div>It seems like your payment didn&apos;t work. Try again later.</div>}
        {sessionSucceededOrSubscription && <div>Thanks for supporting the author!</div>}
      </div>
    </Modal>
  )
}

export default SupportConfirmation;
