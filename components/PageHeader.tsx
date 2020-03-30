function PageHeader({
  children,
}: {
  children: React.ReactChild | React.ReactChild[];
}): React.ReactElement {
  return (
    <h1 className="text-4xl font-serif font-bold mb-4">
      {children}
    </h1>
  );
}

export default PageHeader;
