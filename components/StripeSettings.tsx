import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useForm } from 'react-hook-form';

import { formatAmountForDisplay } from '../lib/stripe';

import StripeSettingsQuery from '../queries/StripeSettingsQuery';
import UpdateStripePricePlanMutation from '../queries/UpdateStripePlanPriceMutation';

import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';
import StripeSettingsFallback from '../components/StripeSettingsFallback';

type FormData = {
  amount: number;
};

const StripeSettings = (): React.ReactElement => {
  const { register, handleSubmit, errors } = useForm<FormData>();
  const { data, loading: dataLoading, error: dataError, refetch } = useQuery(StripeSettingsQuery, { variables: { username: 'me' } });
  
  const [updatePrice, {
    loading: mutationLoading,
    called: mutationCalled,
    error,
  }] = useMutation(UpdateStripePricePlanMutation);

  useEffect(() => {
    if (!mutationLoading && mutationCalled) {
      refetch();
    }
  }, [mutationLoading, mutationCalled]);

  const { user } = data || {};

  const onSubmit = ({ amount }: FormData): void => {
    updatePrice({
      variables: {
        input: { amount: +amount },
      },
    });
  };

  if (dataLoading) return <StripeSettingsFallback />;

  if (dataError) return (
    <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm">
      <h2 className="mb-2 font-bold">
        We weren&apos;t able to get Stripe data.
      </h2>

      <p>
        Rest assured, we&apos;re on it! Check back in a little bit.
      </p>
    </div>
  );

  if (!user?.stripePlan) {
    return (
      <div className="border border-gray-300 rounded-sm p-4 shadow-sm">
        <h2 className="mb-2 font-bold">
          We didn&apos;t find a Stripe account.
        </h2>

        <p className="mb-4">
          Connecting a Stripe account allows you to accept donations and subscriptions.
        </p>

        <ButtonLink href="/earn-money">
          Connect a Stripe account
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm">
      <div>
        <div className="mb-4">
          Your new subscribers will pay <span className="font-bold text-primary">{formatAmountForDisplay(user?.stripePlan?.amount! || 1000)} {user?.stripePlan?.currency.toUpperCase() || 'USD'} per {user?.stripePlan?.interval || 'month'}</span>.
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="font-bold text-primary" htmlFor="amount">
              Your Monthly Price
            </label>

            <input
              className={`border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.amount && 'focus:border-primary'} placeholder-gray-500 ${errors.amount && 'border-red-600'}`}
              id="amount"
              type="number"
              name="amount"
              defaultValue={(user?.stripePlan?.amount! || 1000) / 100}
              placeholder="Enter a subscription price of $1 or more"
              ref={register({
                required: 'Please enter a donation amount',
                min: {
                  value: 1,
                  message: 'The minimum price is $1',
                },
                max: {
                  value: 50,
                  message: 'The maximum donation is $50. Want to charge higher? Let us know!',
                }
              })}
            />

            <span className="text-xs font-bold text-red-600">
              {errors.amount && errors.amount?.message}
              {error && 'Yikes, something went wrong. Please try again in a minute.'}
            </span>
          </div>

          <div className="flex justify-between mb-4">
            <Button
              className="w-1/2 md:w-auto"
              loading={dataLoading || mutationLoading}
              disabled={dataLoading || mutationLoading}
            >
              Save
            </Button>

            {
              user?.stripeDashboardUrl && (
                <div className="w-1/2 flex items-center justify-end">
                  <span>&rarr;&nbsp;</span>
                  <a
                    className="underline text-xs"
                    href={user.stripeDashboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(): void => window.analytics.track('STRIPE SETTINGS: Access dashboard clicked')}
                  >
                    Access your Stripe Dashboard
                  </a>
                </div>
              )
            }
          </div>
        </form>

        <div className="italic text-xs text-center">
          Changing your monthly price will only affect new subscribers.
        </div>
      </div>
    </div>
  );
}

export default StripeSettings;
