import Link from 'next/link';

import { useAuth } from '../hooks/useAuth';

import NavMenu from './NavMenu';
import ButtonLink from './ButtonLink';

function Nav(): React.ReactElement {
  const auth = useAuth();

  return (
    <nav className="px-5 py-1 flex flex-row justify-between items-center border-b border-gray-200">
      <Link href="/">
        <a className="logo font-extrabold text-3xl text-primary font-serif">
          bard.
        </a>
      </Link>

      <div className="flex items-center">
        {
          auth.user
            ? (
              <>
                <ButtonLink href="/write" className="mr-4 py-1">
                  Write
                </ButtonLink>
                
                <NavMenu />
              </>
            )
            : (
              <>
                <Link href="/login">
                  <a className="mr-4">
                    Login
                  </a>
                </Link>

                <ButtonLink href="/signup" className="py-1">
                  Join
                </ButtonLink>
              </>
            )
        }
      </div>
    </nav>
  );
}

export default Nav;
