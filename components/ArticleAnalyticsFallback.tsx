function ArticleFallback(): React.ReactElement {
  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      <div className="mb-8">
        {/* Title */}
        <div className="mb-4">
          <div className="bg-gray-100 h-12 w-64 inline-block"></div>
          <div className="bg-gray-100 h-12 w-64 inline-block"></div>
        </div>

        {/* Summary */}
        <div className="bg-gray-100 h-20 mb-4"></div>

        {/* Published At */}
        <div className="bg-gray-100 h-4 w-48 mb-8"></div>

        {/* Graph */}
        <div className="w-auto bg-gray-100 h-64"></div>
        <div className="w-auto mb-4 bg-gray-100 h-48"></div>
      </div>


      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-10 h-64 w-full bg-gray-50 rounded-sm"></div>
        <div className="p-10 h-64 w-full bg-gray-50 rounded-sm"></div>
        <div className="p-10 h-64 w-full bg-gray-50 rounded-sm"></div>
        <div className="p-10 h-64 w-full bg-gray-50 rounded-sm"></div>
      </div>
    </div>
  );
}

export default ArticleFallback;
