import { useState, useRef } from 'react';
import { FiSettings } from 'react-icons/fi';
import styled from '@emotion/styled'
import Link from 'next/link';
import { useApolloClient, ApolloProvider } from '@apollo/react-hooks';
import createApolloClient from '../lib/apolloClient';

import { useAuth } from '../hooks/useAuth';
import useOnClickOutside from '../hooks/useOnClickOutside';

const Menu = styled.div`
  top: 22px;
  right: -12px;
`;

function DisplayMenu(): React.ReactElement {
  const auth = useAuth();
  const apolloClient = useApolloClient();
  
  const handleLogout = (): void => {
    window.analytics.track('MENU: Logout clicked');
    auth.signOut();

    apolloClient.clearStore();
  }

  return (
    <Menu className="z-40 bg-white border border-gray-300 absolute rounded-sm shadow-sm whitespace-no-wrap">
      <Link href="/write">
        <a
          className="hover:bg-gray-100 block py-2 pl-2 pr-12"
          onClick={(): void => window.analytics.track('MENU: Write an article clicked')}
        >
          Write an article
        </a>
      </Link>

      <Link href="/articles">
        <a
          className="hover:bg-gray-100 block py-2 pl-2 pr-12"
          onClick={(): void => window.analytics.track('MENU: Articles clicked')}
        >
          Articles
        </a>
      </Link>

      <div className="border-b border-gray-200"></div>

      <Link href="/earn-money">
        <a
          className="hover:bg-gray-100 block py-2 pl-2 pr-12"
          onClick={(): void => window.analytics.track('MENU: Earn money clicked')}
        >
          Earn money
        </a>
      </Link>

      <div className="border-b border-gray-200"></div>

      <Link href="/me">
        <a
          className="hover:bg-gray-100 block py-2 pl-2 pr-12"
          onClick={(): void => window.analytics.track('MENU: Profile clicked')}
        >
          Profile
        </a>
      </Link>

      <Link href="/settings">
        <a
          className="hover:bg-gray-100 block py-2 pl-2 pr-12"
          onClick={(): void => window.analytics.track('MENU: Settings clicked')}
        >
          Settings
        </a>
      </Link>

      <a
        className="hover:bg-gray-100 block py-2 pl-2 pr-12"
        onClick={handleLogout}
      >
          Logout
      </a>
    </Menu>
  );
}

function NavMenu(): React.ReactElement {
  const menuRef = useRef(null);
  const [display, setDisplay] = useState(false);

  let apolloClient;
  // Make sure the nav menu always has an Apollo Client
  // If it doesn't exist then the Apollo cache won't
  // properly get cleared on logout
  try {
    apolloClient = useApolloClient();
  } catch {
    apolloClient = createApolloClient({});
  }

  useOnClickOutside(menuRef, () => {
    if (display) {
      setDisplay(!display);
    }
  });

  return (
    <ApolloProvider client={apolloClient}>
      <div
        className="flex justify-end relative ml-4"
        ref={menuRef}
      >
        <FiSettings
          onClick={(): void => {
            setDisplay(!display);
            window.analytics.track('Settings icon clicked');
          }}
          className={`${display && 'text-gray-700'} hover:cursor-pointer hover:text-primary`}
        />

        {display && <DisplayMenu />}
      </div>
    </ApolloProvider>
  );
}

export default NavMenu;
