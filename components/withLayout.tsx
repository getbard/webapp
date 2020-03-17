import { NextPage } from 'next';

import Nav from './Nav';

function withLayout(PageComponent: NextPage): NextPage {
  const PageComponentWithLayout = (): React.ReactElement => {
    return (
      <div>
        <Nav />
  
        <PageComponent />
      </div>
    );
  }

  return PageComponentWithLayout;
}

export default withLayout;