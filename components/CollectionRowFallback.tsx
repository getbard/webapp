function CollectionRow(): React.ReactElement {

  return (
    <div className="border border-gray-300 rounded-sm shadow-sm my-2 p-4 flex justify-between items-center">
      <div>
        {/* Name */}
        <div className="w-64 h-8 mb-2 bg-gray-100"></div>

        {/* Description */}
        <div className="mb-2">
          <div className="bg-gray-100 h-8 w-64 inline-block"></div>
          <div className="bg-gray-100 h-8 w-64 inline-block"></div>
        </div>

        {/* Article Count */}
        <div>
          <div className="w-56 h-4 bg-gray-100 inline-block"></div>
        </div>
      </div>
    </div>
  );
}

export default CollectionRow;
