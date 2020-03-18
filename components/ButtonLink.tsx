import Link from 'next/link';

type Props = {
  children: React.ReactChild;
  href: string;
  className?: string;
}

function ButtonLink({ children, href, className }: Props): React.ReactElement {
  const classes = `bg-primary hover:bg-secondary px-4 p-2 text-white rounded ${className}`
  return (
    <Link href={href}>
      <button className={classes}>
        {children}
      </button>
    </Link>
  );
}

export default ButtonLink;
