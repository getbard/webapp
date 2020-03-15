import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo';

import SEO from '../seo.config.js';
import '../styles/main.css';

import { AuthProvider } from '../hooks/useAuth';

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <>
      <DefaultSeo {...SEO} />
      
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
}

export default App;