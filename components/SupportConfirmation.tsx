import { useQuery } from '@apollo/react-hooks';

import StripeSessionQuery from '../queries/StripeSessionQuery';

import Modal from './Modal';

function SupportConfirmation({ sessionId }: { sessionId: string | string[] }): React.ReactElement {
  const { loading, error, data } = useQuery(StripeSessionQuery, { variables: { id: sessionId } });

  return (
    <Modal open>
      <div>
        {loading && <div>Confirming your payment with Stripe...</div>}
        {error || data?.stripeSession?.status !== 'succeeded' && <div>It seems like your payment didn&apos;t work. Try again later.</div>}
        {data?.stripeSession?.status === 'succeeded' && <div>Thanks for supporting the author!</div>}
      </div>
    </Modal>
  )
}

export default SupportConfirmation;
