import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';

const protectedRoutes = [
  '/write',
  '/edit/[id]',
  '/articles',
];

import Nav from './Nav';

function withLayout(PageComponent: NextPage): NextPage {
  const PageComponentWithLayout = (): React.ReactElement => {
    const router = useRouter();
    const isAuthenticated = cookie.get('token') && protectedRoutes.includes(router.pathname);

    useEffect(() => {
      if (!cookie.get('token') && protectedRoutes.includes(router.pathname)) {
        router.push('/');
      }
    }, []);

    return (
      <div>
        <Nav />
  
        {(isAuthenticated || !protectedRoutes.includes(router.pathname)) && <PageComponent />}

        <div className="pt-5"></div>
      </div>
    );
  }

  return PageComponentWithLayout;
}

export default withLayout;
