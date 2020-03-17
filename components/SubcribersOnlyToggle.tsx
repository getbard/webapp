import styled from '@emotion/styled';

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
  return (
    <div className="flex items-center">
      <label htmlFor="sub-toggle" className="flex items-center cursor-pointer">
        <ToggleBackground
          className={`relative w-12 h-6 ${subscribersOnly ? 'bg-primary' : 'bg-gray-400'} rounded-full shadow-inner px-1 flex items-center`}
          checked={subscribersOnly}
        >
          <input
            id="sub-toggle"
            type="checkbox"
            className="hidden"
            onChange={(e): void => setSubscribersOnly(e.target.checked)}
          />
          <Toggle className="w-4 h-4 bg-white rounded-full shadow" checked={subscribersOnly}></Toggle>
        </ToggleBackground>

        <div className="ml-2">
          {subscribersOnly ? 'Subscribers Only' : 'Public'}
        </div>
      </label>
    </div>
  );
}

export default SubscribersOnlyToggle;
