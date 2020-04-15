import { useState, useRef } from 'react';
import { FiSettings } from 'react-icons/fi';
import styled from '@emotion/styled'
import Link from 'next/link';
import { useApolloClient } from '@apollo/react-hooks';

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
    apolloClient.clearStore();
    auth.signOut();
  }

  return (
    <Menu className="z-40 bg-white border border-gray-300 absolute rounded-sm shadow-sm whitespace-no-wrap">
      <Link href="/write">
        <a className="hover:bg-gray-100 block py-2 pl-2 pr-12">
          Write an article
        </a>
      </Link>

      <Link href="/articles">
        <a className="hover:bg-gray-100 block py-2 pl-2 pr-12">
          Articles
        </a>
      </Link>

      <div className="border-b border-gray-200"></div>

      <Link href="/earn-money">
        <a className="hover:bg-gray-100 block py-2 pl-2 pr-12">
          Earn money
        </a>
      </Link>

      <div className="border-b border-gray-200"></div>

      <Link href="/me">
        <a className="hover:bg-gray-100 block py-2 pl-2 pr-12">
          Profile
        </a>
      </Link>

      <Link href="/settings">
        <a className="hover:bg-gray-100 block py-2 pl-2 pr-12">
          Settings
        </a>
      </Link>

      <a className="hover:bg-gray-100 block py-2 pl-2 pr-12" onClick={handleLogout}>Logout</a>
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
        onClick={(): void => setDisplay(!display)}
        className={`${display && 'text-gray-700'} hover:cursor-pointer hover:text-primary`}
      />

      {display && <DisplayMenu />}
    </div>
  );
}

export default NavMenu;
