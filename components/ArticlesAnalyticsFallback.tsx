import ArticleAnalyticsRowFallback from './ArticleAnalyticsRowFallback';

function ArticlesAnalyticsFallback(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="h-6 w-1/4 bg-gray-50 rounded-sm"></div>
      <div className="h-6 w-1/2 bg-gray-50 rounded-sm"></div>

      <div className="md:flex items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <div className="p-10 h-48 w-1/3 bg-gray-50 rounded-sm"></div>
        <div className="p-10 h-48 w-1/3 bg-gray-50 rounded-sm"></div>
        <div className="p-10 h-48 w-1/3 bg-gray-50 rounded-sm"></div>
      </div>

      <div className="md:flex items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <div className="p-10 h-48 w-1/2 bg-gray-50 rounded-sm"></div>
        <div className="p-10 h-48 w-1/2 bg-gray-50 rounded-sm"></div>
      </div>

      <div className="w-1/4 h-5 bg-gray-100"></div>

      <ArticleAnalyticsRowFallback />
      <ArticleAnalyticsRowFallback />
      <ArticleAnalyticsRowFallback />
      <ArticleAnalyticsRowFallback />
    </div>
  );
}

export default ArticlesAnalyticsFallback;
