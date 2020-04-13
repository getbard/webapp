function SmallArticleCard(): React.ReactElement {
  return (
    <div className="pt-1 pb-4 px-2 rounded-sm">
      {/* Title */}
      <div className="bg-gray-100 h-5 mb-2"></div>

      {/* Summary */}
      <div className="text-gray-600 mt-1 text-sm"></div>

      <div className="text-xs mt-2  font-medium flex justify-between">
        {/* Author */}
        <div className="bg-gray-100 w-16 h-4"></div>

        {/* Published Date / Read Time */}
        <div className="bg-gray-100 w-24 h-4"></div>
      </div>
    </div>
  );
}

export default SmallArticleCard;
