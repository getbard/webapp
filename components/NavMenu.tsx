import { useState, useRef, useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';
import styled from '@emotion/styled'
import Link from 'next/link';
import { useApolloClient } from '@apollo/react-hooks';

import UsernameQuery from '../queries/UsernameQuery';

import { useAuth } from '../hooks/useAuth';
import useOnClickOutside from '../hooks/useOnClickOutside';

const Menu = styled.div`
  top: 22px;
  right: -12px;
`;

function DisplayMenu(): React.ReactElement {
  const auth = useAuth();
  const [username, setUsername] = useState('me');

  let apolloClient: any;
  try {
    apolloClient = useApolloClient();
  } catch(error) {
    // No Apollo Client is in scope
    // The cache will not get cleared if a user logs out
    // This only happens during error states
  }

  useEffect(() => {
    if (apolloClient) {
      apolloClient.query({
        query: UsernameQuery,
        variables: {
          username: 'me',
        },
      }).then(({ data }: any) => {
        const newUsername = data?.user?.username || 'me';

        if (newUsername !== username) {
          setUsername(newUsername);
        }
      });
    }
  }, [apolloClient]);
  
  const handleLogout = (): void => {
    window.analytics.track('MENU: Logout clicked');
    auth.signOut();

    if (apolloClient) {
      apolloClient.clearStore();
    }
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

      <Link href={`/${username}/collections`}>
        <a
          className="hover:bg-gray-100 block py-2 pl-2 pr-12"
          onClick={(): void => window.analytics.track('MENU: Collections clicked')}
        >
          Collections
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

      <Link href={`/${username}`}>
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

      <div className="border-b border-gray-200"></div>

      <a
        className="hover:bg-gray-100 block py-2 pl-2 pr-12"
        href="https://feedback.getbard.com"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(): void => window.analytics.track('MENU: Feedback clicked')}
      >
        Feedback
      </a>

      <Link href="/faq">
        <a
          className="hover:bg-gray-100 block py-2 pl-2 pr-12"
          onClick={(): void => window.analytics.track('MENU: FAQ clicked')}
        >
          FAQ
        </a>
      </Link>

      <div className="border-b border-gray-200"></div>

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

  useOnClickOutside(menuRef, () => {
    if (display) {
      setDisplay(!display);
    }
  });

  return (
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
  );
}

export default NavMenu;
