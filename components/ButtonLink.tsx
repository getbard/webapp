import Link from 'next/link';

type Props = {
  children: React.ReactChild;
  href: string;
  className?: string;
}

function ButtonLink({ children, href, className }: Props): React.ReactElement {
  const classes = `bg-primary hover:bg-secondary px-4 p-2 text-white rounded ${className}`;

  return (
    <button>
      <Link href={href}>
        <a className={classes}>
          {children}
        </a>
      </Link>
    </button>
  );
}

export default ButtonLink;
