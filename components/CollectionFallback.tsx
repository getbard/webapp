import ArticleCardFallback from './ArticleCardFallback';

function CollectionFallback(): React.ReactElement {
  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      {/* Name */}
      <div className="mb-4">
        <div className="bg-gray-100 h-12 w-64 inline-block"></div>
        <div className="bg-gray-100 h-12 w-64 inline-block"></div>
      </div>

      {/* Description */}
      <div className="bg-gray-100 h-20 mb-4"></div>

      {/* User */}
      <div className="bg-gray-100 h-6 w-40 mb-4"></div>
      
      {/* Article Grid */}
      <div className="grid grid-cols-2 gap-2">
        <ArticleCardFallback />
        <ArticleCardFallback />
        <ArticleCardFallback />
        <ArticleCardFallback />
      </div>
    </div>
  );
}

export default CollectionFallback;
