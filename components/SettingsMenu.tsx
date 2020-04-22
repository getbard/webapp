import styled from '@emotion/styled';

import SettingsFooter from './SettingsFooter';

type MenuOptionProps = {
  selected: boolean;
}

const MenuOption = styled.div`
  text-transform: capitalize;
  font-weight: ${(props: MenuOptionProps): string => props.selected ? 'bold' : ''};
  color: ${(props: MenuOptionProps): string => props.selected ? '#004346' : ''};

  &:hover {
    cursor: pointer;
    color: #004346;
  }
`;

const SettingsMenu = ({
  settingsOptions,
  settingsOption,
  setSettingsOption,
}: {
  settingsOptions: string[];
  settingsOption: string;
  setSettingsOption: (option: string) => void;
}): React.ReactElement => (
    <div className="col-span-2 mr-4 h-full text-center">
      <menu className="p-0 mt-0">
        {settingsOptions.map(option => (
          <MenuOption
            key={option}
            onClick={(): void => {
              window.analytics.track(`SETTINGS MENU: ${option} clicked`);
              setSettingsOption(option);
            }}
            selected={settingsOption === option}
          >
            {option}
          </MenuOption>
        ))}
      </menu>

      <div className="hidden sm:block">
        <SettingsFooter />
      </div>
    </div>
  );

export default SettingsMenu;
