import { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import styled from '@emotion/styled'

import { useAuth } from '../hooks/useAuth';

const StyledCog = styled(FaCog)`
  &:hover {
    cursor: pointer;
  }
`;

const Menu = styled.div`
  top: 22px;
  right: -12px;
`;

function DisplayMenu(): React.ReactElement {
  const auth = useAuth();

  return (
    <Menu className="z-20 px-4 bg-white border border-gray-300 absolute rounded-sm shadow-sm flex flex-col">
      <a className="my-2" onClick={(): Promise<boolean | void> => auth.signOut()}>Logout</a>
    </Menu>
  );
}

function NavMenu(): React.ReactElement {
  const [display, setDisplay] = useState(false);

  return (
    <div className="flex justify-end relative">
      <StyledCog onClick={(): void => setDisplay(!display)} />

      {display && <DisplayMenu />}
    </div>
  );
}

export default NavMenu;
