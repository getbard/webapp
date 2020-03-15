import Link from 'next/link';

import { useAuth } from '../hooks/useAuth';

function Nav(): React.ReactElement {
  const auth = useAuth();
console.log(auth.user);
  return (
    <nav className="px-5 flex flex-row justify-between items-center border-b border-gray-200">
      <Link href="/">
        <a className="logo font-extrabold text-3xl text-primary font-serif">
          bard.
        </a>
      </Link>

      <div>
        {
          auth.user
            ? <a className="pr-2" onClick={(): Promise<boolean | void> => auth.signOut()}>Sign Out</a>
            : <Link href="/login"><a className="pr-2">Login</a></Link>
        }
      </div>
    </nav>
  );
}

export default Nav;
