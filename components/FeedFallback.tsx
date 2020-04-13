import ArticleCardFallback from './ArticleCardFallback';

function Item({ displayArticleFallback }: { displayArticleFallback?: boolean }): React.ReactElement {
  return (
    <div className="rounded-sm p-5 border border-gray-200 my-4">
      <div>
        <div className="h-4 w-64 bg-gray-100 mb-2"></div>

        <div className="h-4 w-20 bg-gray-100"></div>
      </div>

      {
        displayArticleFallback && (
          <div className="mt-4">
            <ArticleCardFallback />
          </div>
        )
      }
    </div>
  );
}

function FeedFallback(): React.ReactElement {
  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      <Item displayArticleFallback />
      <Item />
      <Item />
    </div>
  );
}

export default FeedFallback;
