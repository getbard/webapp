function CommentsFallback(): React.ReactElement {
  return (
    <div className="mt-10">
      <div className="border border-gray-200 rounded-sm">
        <div className="h-20"></div>
        <div className="bg-gray-50 border-t border-gray-200 h-10"></div>
      </div>

      <div className="mt-2 border border-gray-200 rounded-sm">
        <div className="p-2">
          <div className="bg-gray-200 w-64 h-4 mb-2"></div>
          <div className="bg-gray-200 w-56 h-4"></div>
        </div>

        <div className="flex items-center justify-between h-10 pl-4 pr-2 py-1 bg-gray-50 border-t border-gray-200">
          <div className="bg-gray-200 w-40 h-4"></div>
        </div>
      </div>

      <div className="mt-2 border border-gray-200 rounded-sm">
        <div className="p-2">
          <div className="bg-gray-200 w-64 h-4 mb-2"></div>
          <div className="bg-gray-200 w-56 h-4"></div>
        </div>

        <div className="flex items-center justify-between h-10 pl-4 pr-2 py-1 bg-gray-50 border-t border-gray-200">
          <div className="bg-gray-200 w-40 h-4"></div>
        </div>
      </div>
    </div>
  );
}

export default CommentsFallback;
