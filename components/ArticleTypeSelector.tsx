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
  return (
    <div
      className={`${articleType !== name.toLowerCase() && 'text-gray-500'} inline mr-8 text-2xl hover:cursor-pointer`}
      onClick={(): void => setArticleType(name.toLowerCase())}
    >
      {name} ({count})
    </div>
  );
}

export default ArticleTypeSelector;
