import Router from 'next/router';
import { useEffect } from 'react';

import { NextPage } from 'next';

const Index: NextPage = (): React.ReactElement => {
  useEffect((): void => {
    Router.push('/discover');
  });

  return (
    <></>
  );
}

export default Index;
