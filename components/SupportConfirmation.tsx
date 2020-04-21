import { useQuery } from '@apollo/react-hooks';

import StripeSessionQuery from '../queries/StripeSessionQuery';

import Modal from './Modal';

function SupportConfirmation({
  sessionId,
  stripeUserId,
  refetch,
}: {
  sessionId: string | string[];
  stripeUserId: string;
  refetch?: () => void;
}): React.ReactElement {
  const { loading, error, data } = useQuery(StripeSessionQuery, { variables: { id: sessionId, stripeUserId } });
  const sessionSucceededOrSubscription = data?.stripeSession?.status === 'succeeded' || data?.stripeSession?.subscription;
  const supportConfirmationFailed = (error || (data?.stripeSession?.status !== 'succeeded' && !data?.stripeSession?.subscription))

  if (sessionSucceededOrSubscription) {
    window.analytics.track('SUPPORT CONFIRMATION: Succeeded', { sessionId, stripeUserId });
  }

  if (supportConfirmationFailed) {
    window.analytics.track('SUPPORT CONFIRMATION: Failed', {
      sessionId,
      stripeUserId,
      error: {
        message: error?.message,
      }
    });
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
