import styled from '@emotion/styled';


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
    <menu className="col-span-1 mt-0 p-0 mr-4">
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
  );

export default SettingsMenu;
