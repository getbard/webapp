function ArticleRowFallback(): React.ReactElement {
  return (
    <div className="border border-gray-200 rounded-sm shadow-sm my-2 p-4 flex justify-between items-center">
      <div>
        {/* Title */}
        <div className="w-64 h-8 mb-2 bg-gray-100"></div>

        {/* Summary */}
        <div className="mb-2">
          <div className="bg-gray-100 h-8 w-64 inline-block"></div>
          <div className="bg-gray-100 h-8 w-64 inline-block"></div>
        </div>

        {/* Date Meta */}
        <div>
          <div className="w-56 h-4 bg-gray-100 inline-block"></div>
          <div className="w-20 h-4 bg-gray-100 inline-block ml-1"></div>
        </div>
      </div>
    </div>
  );
}

export default ArticleRowFallback;
