import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo';

import SEO from '../seo.config.js';
import '../styles/main.css';

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  )
}

export default App;