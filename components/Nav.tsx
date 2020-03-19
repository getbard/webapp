import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import NavMenu from './NavMenu';
import ButtonLink from './ButtonLink';

function LoggedInMenu(): React.ReactElement {
  const router = useRouter();

  return (
    <>
      {router.pathname !== '/write' && (
        <ButtonLink href="/write" className="py-1">
          Write
        </ButtonLink>
      )}

      <NavMenu />
    </>
  )
}

function LoggedOutMenu(): React.ReactElement {
  return (
    <>
      <Link href = "/login">
        <a className="mr-4">
          Login
        </a>
      </Link>

      <ButtonLink href="/signup" className="py-1">
        Join
      </ButtonLink>
    </>
  );
}

function Nav(): React.ReactElement {
  const auth = useAuth();

  return (
    <nav className="py-1 border-b border-gray-200">
      <div className="container mx-auto flex flex-row justify-between items-center px-5">
        <Link href="/">
          <a className="logo font-extrabold text-3xl text-primary font-serif">
            bard.
          </a>
        </Link>

        <div className="flex items-center">
          {
            auth.user || auth.userId
              ? <LoggedInMenu/>
              : <LoggedOutMenu/>
          }
        </div >
      </div >
    </nav >
  );
}

export default Nav;
