import * as Sentry from '@sentry/node';

function GenericError({
  title,
  message = `Something went wrong but we're working on it. Try again in a bit.`,
  error,
}: {
  title?: boolean;
  message?: string;
  error: any;
}): React.ReactElement {
  Sentry.captureException(error);

  return (
    <div className="flex justify-center items-center flex-col p-40 text-lg">
      {
        title && (
          <div className="text-4xl text-center font-serif">
            <div>
              The past, the present, and the future walked into a bar.
            </div>

            <div>
              It was tense.
            </div>
          </div>
        )
      }

      {message}
    </div>
  );
}

export default GenericError;
