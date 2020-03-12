import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo';

import Layout from '../components/Layout';

import SEO from '../seo.config.js';
import '../styles/main.css';

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <>
      <DefaultSeo {...SEO} />
      
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default App;