import styled from '@emotion/styled';
import Link from 'next/link';


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
    <div className="col-span-2 mr-4 h-full">
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

      <footer className="text-xs border-t border-gray-200 pt-4">
        <Link href="/about">
          <a className="mr-4 inline-block">
            About
          </a>
        </Link>

        <Link href="/faq">
          <a className="mr-4 inline-block">
            FAQ
          </a>
        </Link>

        <a 
          className="mr-4 inline-block"
          href="https://feedback.getbard.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(): void => window.analytics.track('MENU: Feedback clicked')}
        >
          Feedback
        </a>

        <Link href="/privacy">
          <a className="mr-4 inline-block">
            Privacy
          </a>
        </Link>

        <Link href="/terms">
          <a className="mr-4 inline-block">
            Terms
          </a>
        </Link>
      </footer>
    </div>
  );

export default SettingsMenu;
