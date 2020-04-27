import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import NavMenu from './NavMenu';
import ButtonLink from './ButtonLink';

function LoggedInMenu(): React.ReactElement {
  const router = useRouter();
  const isWritePage = router.pathname === '/write';
  const isAboutPage = router.pathname === '/about';

  return (
    <div className="flex items-center">
      {!isAboutPage && (
        <Link href="/about">
          <a
            className={`${!isWritePage ? 'mr-4' : ''}`}
            onClick={(): void => window.analytics.track('NAV: Why Bard? clicked')}
          >
            Why Bard?
          </a>
        </Link>
      )}

      {!isWritePage && (
        <ButtonLink
          href="/write"
          thin
          trackEvent="NAV: Write clicked"
        >
          Write
        </ButtonLink>
      )}

      <NavMenu />
    </div>
  )
}

function LoggedOutMenu(): React.ReactElement {
  const router = useRouter();
  const isAboutPage = router.pathname === '/about';

  return (
    <div className="flex items-center">
      {!isAboutPage && (
        <Link href="/about">
          <a
            className="mr-4"
            onClick={(): void => window.analytics.track('NAV: Why Bard? clicked')}
          >
            Why Bard?
          </a>
        </Link>
      )}

      <Link href = "/login">
        <a
          className="mr-4"
          onClick={(): void => window.analytics.track('NAV: Login clicked')}
        >
          Login
        </a>
      </Link>

      <ButtonLink
        href="/signup"
        thin
        trackEvent="NAV: Join clicked"
      >
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
          <a
            className="logo font-extrabold text-3xl text-primary font-serif"
            onClick={(): void => window.analytics.track('NAV: logo clicked')}
          >
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
