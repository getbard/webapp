import { useQuery } from '@apollo/react-hooks';

import StripeSessionQuery from '../queries/StripeSessionQuery';

import Modal from './Modal';

function SupportConfirmation({
  sessionId,
  stripeUserId,
}: {
  sessionId: string | string[];
  stripeUserId: string;
}): React.ReactElement {
  const { loading, error, data } = useQuery(StripeSessionQuery, { variables: { id: sessionId, stripeUserId } });
  return (
    <Modal open>
      <div>
        {loading && <div>Confirming your payment with Stripe...</div>}
        {(error || (data?.stripeSession?.status !== 'succeeded' && !data?.stripeSession?.subscription)) && <div>It seems like your payment didn&apos;t work. Try again later.</div>}
        {(data?.stripeSession?.status === 'succeeded' || data?.stripeSession?.subscription) && <div>Thanks for supporting the author!</div>}
      </div>
    </Modal>
  )
}

export default SupportConfirmation;
