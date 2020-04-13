import ArticlesFallback from '../components/ArticlesFallback';

function UserProfileFallback(): React.ReactElement {
  return (
    <div className="px-5 pt-5 grid grid-cols-4 gap-5">
      <div className="flex items-center flex-col">
        {/* Name */}
        <div className="bg-gray-100 h-10 w-full mb-4"></div>

        {/* Username */}
        <div className="bg-gray-100 h-8 w-40 mb-4"></div>
        
        {/* Joined / Follow Section */}
        <div className="bg-gray-100 h-6 w-48 mb-2"></div>
        <div className="bg-gray-100 h-6 w-32 mb-2"></div>
        <div className="bg-gray-100 h-6 w-32"></div>
      </div>

      <div className="col-span-3">
        <div className="mb-2 pb-4 border-b border-gray-300">
          {/* Profile Selectors */}
          <div className="bg-gray-100 h-8 w-40 inline-block"></div>
          <div className="bg-gray-100 h-8 w-40 inline-block ml-4"></div>
        </div>

        <ArticlesFallback />
      </div>
    </div>
  );
}

export default UserProfileFallback;
