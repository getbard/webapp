import React from 'react';
import Error from 'next/error';
import * as Sentry from '@sentry/node';
import { NextSeo } from 'next-seo';
import Link from 'next/link';

const BardError = ({
  statusCode,
  hasGetInitialPropsRun,
  err,
}: {
  statusCode: number;
  hasGetInitialPropsRun: boolean;
  err: Error | null;
}): React.ReactElement => {
  if (!hasGetInitialPropsRun && err) {
    Sentry.captureException(err);
  }

  let description = `Something went wrong. We're on it!`;
  let title = 'As a writer, you should not judge, you should understand.';
  let body = `Something went wrong on our end. We know that must be frustrating but we're working hard to fix it.`;

  if (statusCode === 404) {
    description = `We couldn't find what you were looking for.`;
    title = 'Not all those who wander are lost.';
    body = `J.R.R. Tolkien was right. And we couldn't find what you were looking for.`;
  }

  return (
    <>
      <NextSeo
        title={statusCode?.toString() || '500'}
        description={description}
      />

      <div className="flex justify-center items-center flex-col p-40 text-lg">
        <div className="text-4xl text-center font-serif">
          <div>
            {title}
          </div>
        </div>

        <div>
          {body}
        </div>

        <Link href="/">
          <a className="underline">
            Find your way home
          </a>
        </Link>
      </div>
    </>
  );
}

BardError.getInitialProps = async ({ res, err, asPath }: any): Promise<any> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const errorInitialProps = await Error.getInitialProps({ res, err });

  errorInitialProps.hasGetInitialPropsRun = true

  if (res) {
    if (res.statusCode === 404) {
      // Do not record an exception in Sentry for 404
      return { statusCode: 404 };
    }

    if (err) {
      Sentry.captureException(err)
      return errorInitialProps;
    }
  } else {
    if (err) {
      Sentry.captureException(err)
      return errorInitialProps;
    }
  }

  Sentry.captureException(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
  );

  return errorInitialProps;
}

export default BardError;
