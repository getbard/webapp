import App from 'next/app';
import { DefaultSeo } from 'next-seo';
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.RELEASE,
});

import SEO from '../seo.config.js';

import '../styles/main.css';
import 'emoji-mart/css/emoji-mart.css';

import { AuthProvider } from '../hooks/useAuth';

class BardApp extends App {
  render(): React.ReactElement {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const { Component, pageProps, err } = this.props;
    const modifiedPageProps = { ...pageProps, err };

    return (
      <>
        <DefaultSeo {...SEO} />
        
        <AuthProvider userId={pageProps.userId}>
          <Component {...modifiedPageProps} />
        </AuthProvider>
      </>
    );
  }
}

export default BardApp;