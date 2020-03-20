import { useState, useRef } from 'react';
import { FiSettings } from 'react-icons/fi';
import styled from '@emotion/styled'
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';
import useOnClickOutside from '../hooks/useOnClickOutside';

const Menu = styled.div`
  top: 22px;
  right: -12px;
`;

function DisplayMenu(): React.ReactElement {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = (): void => {
    auth.signOut();
    if (router.pathname !== '/') {
      router.push('/');
    }
  }

  return (
    <Menu className="z-20 bg-white border border-gray-300 absolute rounded-sm shadow-sm whitespace-no-wrap">
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

      <div className="border-b border-gray-100"></div>

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
