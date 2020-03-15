import Link from 'next/link';

type Props = {
  children: React.ReactChild;
  href: string;
  className?: string;
}

function ButtonLink({ children, href, className }: Props): React.ReactElement {
  const classes = `bg-primary hover:bg-secondary hover:text-primary px-4 p-1 text-snow rounded font-serif ${className}`
  return (
    <Link href={href}>
      <a className={classes}>
        {children}
      </a>
    </Link>
  );
}

export default ButtonLink;
