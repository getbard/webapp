import Link from 'next/link';

type Props = {
  children: React.ReactChild;
  href: string;
  thin?: boolean;
}

function ButtonLink({ children, href, thin }: Props): React.ReactElement {
  const yPadding = thin ? 'py-1' : 'py-2';
  const classes = `button transition duration-150 ease-in-out bg-primary hover:bg-secondary px-4 ${yPadding} text-white rounded`;
  
  return (
    <Link href={href}>
      <a className={classes}>
        {children}
      </a>
    </Link>
  );
}

export default ButtonLink;
