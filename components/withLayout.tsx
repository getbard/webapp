import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';
import '@stripe/stripe-js';

const protectedRoutes = [
  '/write',
  '/edit/[id]',
  '/articles',
  '/settings',
  '/analytics',
];

import Nav from './Nav';

function withLayout(PageComponent: NextPage): NextPage {
  const PageComponentWithLayout = ({ ...pageProps }): React.ReactElement => {
    const router = useRouter();
    const isAuthenticated = cookie.get('token') && protectedRoutes.includes(router.pathname);

    useEffect(() => {
      if (!cookie.get('token') && protectedRoutes.includes(router.pathname)) {
        router.push(`/login?redirect=${router.asPath}`);
      }
    }, []);

    return (
      <div>
        <Nav />
  
        {
          (isAuthenticated || !protectedRoutes.includes(router.pathname))
          && <PageComponent {...pageProps} />
        }
      </div>
    );
  }

  return PageComponentWithLayout;
}

export default withLayout;
