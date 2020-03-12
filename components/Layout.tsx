import Nav from './Nav';

type Props = {
  children: React.ReactChild | React.ReactChild[];
}

function Layout({ children }: Props): React.ReactElement {
  return (
    <div>
      <Nav />

      {children}
    </div>
  );
}

export default Layout;
