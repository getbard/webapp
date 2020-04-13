function EmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactChild | React.ReactChild[] | React.ReactChildren;
}): React.ReactElement {
  return (
    <div className="flex justify-center items-center flex-col p-40 text-lg">
      <div className="text-4xl font-serif">
        {title}
      </div>

      {children}
    </div>
  );
}

export default EmptyState;
