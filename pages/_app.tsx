import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo';

import SEO from '../seo.config.js';

import '../styles/main.css';
import 'emoji-mart/css/emoji-mart.css';

import { AuthProvider } from '../hooks/useAuth';

function BardApp({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <>
      <DefaultSeo {...SEO} />
      
      <AuthProvider userId={pageProps.userId}>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
}

export default BardApp;