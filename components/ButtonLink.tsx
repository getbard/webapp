import Link from 'next/link';

type Props = {
  children: React.ReactChild;
  href: string;
  thin?: boolean;
  trackEvent?: string;
}

function ButtonLink({
  children,
  href,
  thin,
  trackEvent,
}: Props): React.ReactElement {
  const yPadding = thin ? 'py-1' : 'py-2';
  const classes = `button transition duration-150 ease-in-out bg-primary hover:bg-secondary px-4 ${yPadding} text-white rounded`;
  
  return (
    <Link href={href}>
      <a
        className={classes}
        onClick={(): void => {
          if (trackEvent) {
            window.analytics.track(trackEvent);
          }
        }}
      >
        {children}
      </a>
    </Link>
  );
}

export default ButtonLink;
