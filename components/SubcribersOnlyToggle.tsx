import { useState } from 'react';
import styled from '@emotion/styled';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';

import StripeUserIdQuery from '../queries/StripeUserIdQuery';

type Props = {
  subscribersOnly: boolean;
  setSubscribersOnly: (subscribersOnly: boolean) => void;
}

type ToggleProps = {
  checked: boolean;
}

const ToggleBackground = styled.div<ToggleProps>`
  transition: all 0.3s ease-in-out;
`;

const Toggle = styled.div<ToggleProps>`
  transition: all 0.3s ease-in-out;
  transform: ${(props): string => props.checked ? 'translateX(150%)' : 'translateX(0%)'}
`;

function SubscribersOnlyToggle({ subscribersOnly, setSubscribersOnly }: Props): React.ReactElement {
  const [disabled, setDisabled] = useState(true);
  const { data, loading, called } = useQuery(StripeUserIdQuery, { variables: { username: 'me' }});
  const cursor = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

  const { user } = data || {};
  if (user?.stripeUserId && disabled) {
    setDisabled(false);
  }

  return (
    <div className="flex flex-col justify-center">
      <label htmlFor="sub-toggle" className={`flex items-center cursor-pointer ${cursor}`}>
        <ToggleBackground
          className={`relative w-12 h-6 ${subscribersOnly ? 'bg-primary' : 'bg-gray-400'} rounded-full shadow-inner px-1 flex items-center`}
          checked={subscribersOnly}
        >
          <input
            disabled={disabled}
            id="sub-toggle"
            type="checkbox"
            className="hidden"
            onChange={(e): void => {
              if (!disabled) {
                setSubscribersOnly(e.target.checked);
              }
            }}
          />
          <Toggle className="w-4 h-4 bg-white rounded-full shadow" checked={subscribersOnly}></Toggle>
        </ToggleBackground>

        <div className="ml-2">
          {subscribersOnly ? 'Supporters Only' : 'Public'}
        </div>
      </label>

      {
        disabled && !loading && called && (
          <div className="text-xs">
            <Link href="/earn-money"><a className="underline">Connect a Stripe account</a></Link> to create supporter only content
          </div>
        )
      }
    </div>
  );
}

export default SubscribersOnlyToggle;
