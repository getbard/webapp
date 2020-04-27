import { useQuery, useMutation } from '@apollo/react-hooks';
import { fromUnixTime, format } from 'date-fns';
import Link from 'next/link';

import { formatAmountForDisplay } from '../lib/stripe';

import { Subscription } from '../generated/graphql';

import UserSubscriptionsQuery from '../queries/UserSubscriptionsQuery';
import CancelSubscriptionMutation from '../queries/CancelSubscriptionMutation';

import Button from './Button';
import Notification from './Notification';
import SubscriptionsFalback from './SubscriptionsFallback';

const SubscriptionRow = ({
  subscription,
  refetch,
}: {
  subscription: Subscription;
  refetch: () => void;
}): React.ReactElement => {
  const { author, plan, currentPeriodEnd, createdAt } = subscription;
  const authorName = `${author.firstName}${author?.lastName && ' ' + author.lastName}`;
  const [cancelSubscription, { data, called, error, loading }] = useMutation(CancelSubscriptionMutation, {
    update() {
      refetch();
    }
  });

  const trackingData = {
    authorId: author.id,
    plan,
    planId: plan.id,
    amount: plan.amount,
    currency: plan.currency,
    interval: plan.interval,
    currentPeriodEnd,
    createdAt,
  };

  const handleCancel = (): void => {
    window.analytics.track('SUBSCRIPTION ROW: Cancel clicked', trackingData);
    cancelSubscription({ variables: { input: { id: subscription.id } } });
  }

  return (
    <div className="flex justify-between items-center border border-gray-300 rounded-sm p-4 mb-4">
      <div>
        <h2 className="text-base mb-2 font-medium">
          Supporting <Link href={`/${author.username}`} ><a className="font-bold">{authorName}</a></Link>
          &nbsp;since {format(new Date(createdAt), 'MMMM d, yyyy')}
        </h2>

        <div>
          {formatAmountForDisplay(plan.amount, plan.currency)} {plan.currency.toUpperCase()} per {plan.interval}
        </div>

        <div className="underline">
          Your next charge will occur on {format(fromUnixTime(currentPeriodEnd), 'MMMM d, yyyy')}
        </div>
      </div>

      <Button
        loading={loading}
        onClick={handleCancel}
      >
        Cancel
      </Button>

      <Notification showNotification={(data && called) || !!error} error={error}>
        Cancelled
      </Notification>
    </div>
  );
}

const SubscriptionSettings = (): React.ReactElement => {
  const { loading, data, error, refetch } = useQuery(UserSubscriptionsQuery, { variables: { username: 'me' } });

  if (loading) return <SubscriptionsFalback />;

  if (error) return (
    <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm">
      <h2 className="mb-2 font-bold">
        We weren&apos;t able to get your subscriptions.
      </h2>

      <p>
        Rest assured, we&apos;re on it! Check back in a little bit.
      </p>
    </div>
  );

  if (!data?.user?.subscriptions.length) {
    return (
      <div className="border border-gray-300 rounded-sm p-4 shadow-sm">
        <h2 className="mb-2 font-bold">
          We didn&apos;t find any subscriptions.
        </h2>

        <p>
          Supporting authors you love helps them write great content. That&apos;s what Bard is all about. While it isn&apos;t necessarily required, we highly encourage it.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {data?.user?.subscriptions.map((subscription: Subscription) => (
        <SubscriptionRow key={subscription.id} subscription={subscription} refetch={refetch} />
      ))}
    </div>
  );
}

export default SubscriptionSettings;
