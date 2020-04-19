type ArticleTypeSelectorProps = {
  articleType: string;
  setArticleType: (name: string) => void;
  name: string;
  count: number;
}

export function ArticleTypeSelector({
  articleType,
  setArticleType,
  name,
  count,
}: ArticleTypeSelectorProps): React.ReactElement {
  const active = articleType === name.toLowerCase();
  const classes = `${active && 'border-b-2 border-primary'} ${active && 'text-primary'} text-gray-500 pb-5 inline mr-8 text-2xl hover:cursor-pointer hover:text-primary transition duration-150 ease-in-out`;

  const handleClick = (): void => {
    window.analytics.track(`ARTICLE TYPE SELECTOR: ${name} clicked`);
    setArticleType(name.toLowerCase());
  }

  return (
    <div
      className={classes}
      onClick={handleClick}
    >
      {name} ({count})
    </div>
  );
}

export default ArticleTypeSelector;
