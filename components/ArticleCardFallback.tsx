function ArticleCardFallback(): React.ReactElement {
  return (
    <div className="p-4 border border-gray-200 rounded-sm flex justify-between flex-col">
      <div className="flex-grow flex items-end h-40 rounded-t-sm -mt-3 -mx-3 mb-3 bg-gray-100"></div>
    
      <div>
        {/* Title */}
        <div className="bg-gray-100 h-5 mb-2"></div>

        {/* Summary */}
        <div className="bg-gray-100 h-8 mb-2"></div>
        
        <div className="flex justify-between">
          {/* Author */}
          <div className="bg-gray-100 w-16 h-4"></div> 

          {/* Published Date / Read Time */}
          <div className="bg-gray-100 w-24 h-4"></div>
        </div>
      </div>
    </div>
  );
}

export default ArticleCardFallback;
