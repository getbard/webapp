import styled from '@emotion/styled';

type Props = {
  isPrivate: boolean;
  onClick: (isPrivate: boolean) => void;
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

function PublicCollectionToggle({ isPrivate, onClick }: Props): React.ReactElement {

  return (
    <div className="flex flex-col justify-center">
      <label htmlFor="sub-toggle" className={`flex items-center cursor-pointer`}>
        <ToggleBackground
          className={`relative w-12 h-6 ${isPrivate ? 'bg-primary' : 'bg-gray-400'} rounded-full shadow-inner px-1 flex items-center`}
          checked={isPrivate}
        >
          <input
            id="sub-toggle"
            type="checkbox"
            className="hidden"
            onChange={(e): void => {
              const isChecked = e.target.checked;
              window.analytics.track('PUBLIC COLLECTION TOGGLE: Toggle clicked', { isPrivate: isChecked });
              onClick(!isChecked);
            }}
          />
          <Toggle className="w-4 h-4 bg-white rounded-full shadow" checked={isPrivate}></Toggle>
        </ToggleBackground>

        <div className="ml-2">
          {isPrivate ? 'Private' : 'Public'}
        </div>
      </label>
    </div>
  );
}

export default PublicCollectionToggle;
