import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import NavMenu from './NavMenu';
import ButtonLink from './ButtonLink';

function LoggedInMenu(): React.ReactElement {
  const router = useRouter();

  return (
    <span className="flex items-center">
      {router.pathname !== '/write' && (
        <ButtonLink href="/write" thin>
          Write
        </ButtonLink>
      )}

      <NavMenu />
    </span>
  )
}

function LoggedOutMenu(): React.ReactElement {
  return (
    <div className="flex items-center">
      <Link href = "/login">
        <a className="mr-4">
          Login
        </a>
      </Link>

      <ButtonLink href="/signup" thin>
        Join
      </ButtonLink>
    </div>
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

        {
          auth.user || auth.userId
            ? <LoggedInMenu/>
            : <LoggedOutMenu/>
        }
      </div >
    </nav >
  );
}

export default Nav;
