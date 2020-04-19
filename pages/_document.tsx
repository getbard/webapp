import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import * as snippet from '@segment/snippet';

export default class extends Document {
  renderSnippet(): any {
    console.log('SNIPPY!');
    const opts = {
      apiKey: process.env.SEGMENT_WRITE_KEY,
      // note: the page option only covers SSR tracking.
      // Page.js is used to track other events using `window.analytics.page()`
      page: true,
    };

    if (process.env.NODE_ENV === 'development') {
      return snippet.max(opts);
    }

    // Minified script
    return snippet.min(opts);
  }

  render(): React.ReactElement {
    console.log('WUT');
    return (
      <Html>
        <Head>
          {/* Inject the Segment snippet into the <head> of the document  */}
          <script dangerouslySetInnerHTML={{ __html: this.renderSnippet() }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
