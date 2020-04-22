function EmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactChild | React.ReactChild[] | React.ReactChildren;
}): React.ReactElement {
  return (
    <div className="flex justify-center items-center flex-col p-10 md:p-40 md:text-lg text-center">
      <div className="text-2xl md:text-4xl font-serif">
        {title}
      </div>

      {children}
    </div>
  );
}

export default EmptyState;
