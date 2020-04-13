function ArticleFallback(): React.ReactElement {
  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      <div className="mb-8">
        {/* Header Image */}
        <div className="w-auto -mx-5 sm:-mx-40 bg-gray-200 h-64"></div>
        <div className="w-auto -mx-5 sm:-mx-40 mb-4 bg-gray-200 h-48"></div>

        {/* Category */}
        <div className="bg-gray-200 h-6 w-48 mb-4"></div>

        {/* Title */}
        <div className="mb-4">
          <div className="bg-gray-200 h-12 w-64 inline-block"></div>
          <div className="bg-gray-200 h-12 w-64 inline-block"></div>
        </div>

        {/* Summary */}
        <div className="bg-gray-200 h-20 mb-4"></div>

        {/* Author */}
        <div className="bg-gray-200 h-6 w-40 mb-4"></div>

        {/* Date Meta */}
        <div className="bg-gray-200 h-4 w-48 mb-4"></div>
      </div>

      {/* Content */}
      <div className="bg-gray-200 h-screen"></div>
    </div>
  );
}

export default ArticleFallback;
