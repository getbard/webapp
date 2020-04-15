import React from 'react';
import Error from 'next/error';
import * as Sentry from '@sentry/node'

const BardError = ({
  statusCode,
  hasGetInitialPropsRun,
  err,
}: {
  statusCode: number;
  hasGetInitialPropsRun: boolean;
  err: Error;
}): React.ReactElement => {
  console.log('Hello?', hasGetInitialPropsRun, err);
  if (!hasGetInitialPropsRun && err) {
    Sentry.captureException(err);
  }

  return <Error statusCode={statusCode} />;
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
