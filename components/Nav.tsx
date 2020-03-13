import Link from 'next/link';

function Nav(): React.ReactElement {
  return (
    <nav className="px-5 flex flex-row justify-between items-center shadow-sm">
      <Link href="/">
        <a className="logo font-extrabold text-3xl text-primary font-serif">
          bard.
        </a>
      </Link>

      <Link href="/open-letter">
        <a>
          An Open Letter
        </a>
      </Link>
    </nav>
  );
}

export default Nav;
