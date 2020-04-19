function GenericError({
  title,
  message = `Something went wrong but we're working on it. Try again in a bit.`,
}: {
  title?: boolean;
  message?: string;
}): React.ReactElement {
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
