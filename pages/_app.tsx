import App from 'next/app'
import { DefaultSeo } from 'next-seo'

import SEO from '../seo.config.js'

import '../styles/main.css'

class BardApp extends App {
  render(): React.ReactElement {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const { Component, pageProps, err } = this.props
    const modifiedPageProps = { ...pageProps, err }

    return (
      <>
        <DefaultSeo {...SEO} />

        <Component {...modifiedPageProps} />
      </>
    )
  }
}

export default BardApp
