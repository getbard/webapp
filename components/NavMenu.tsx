import { useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import styled from '@emotion/styled'
import Link from 'next/link';

import { useAuth } from '../hooks/useAuth';

const Menu = styled.div`
  top: 22px;
  right: -12px;
`;

function DisplayMenu(): React.ReactElement {
  const auth = useAuth();

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

      <a className="hover:bg-gray-100 block py-2 pl-2 pr-12" onClick={(): Promise<boolean | void> => auth.signOut()}>Logout</a>
    </Menu>
  );
}

function NavMenu(): React.ReactElement {
  const [display, setDisplay] = useState(false);

  return (
    <div className="flex justify-end relative ml-4">
      <FiSettings
        onClick={(): void => setDisplay(!display)}
        className={`${display && 'text-gray-700'} hover:cursor-pointer hover:text-primary`}
      />

      {display && <DisplayMenu />}
    </div>
  );
}

export default NavMenu;
