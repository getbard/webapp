import Link from 'next/link';

function SettingsFooter(): React.ReactElement {
  return (
    <footer className="text-xs border-t border-gray-200 pt-4 text-center md:text-right">
      <Link href="/about">
        <a className="mr-4 md:mr-0 inline-block md:block">
          About
        </a>
      </Link>

      <Link href="/faq">
        <a className="mr-4 md:mr-0 inline-block md:block">
          FAQ
        </a>
      </Link>

      <a
        className="mr-4 md:mr-0 inline-block md:block"
        href="https://feedback.getbard.com"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(): void => window.analytics.track('MENU: Feedback clicked')}
      >
        Feedback
      </a>

      <Link href="/privacy">
        <a className="mr-4 md:mr-0 inline-block md:block">
          Privacy
        </a>
      </Link>

      <Link href="/terms">
        <a className="mr-4 md:mr-0 inline-block md:block">
          Terms
        </a>
      </Link>
    </footer>
  );
}

export default SettingsFooter;
