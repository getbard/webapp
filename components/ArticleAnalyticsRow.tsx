
import Link from 'next/link';
import { FiFeather } from 'react-icons/fi';

import { Article } from '../generated/graphql';

import { timeToRead } from '../lib/editor';
import DateMeta from './DateMeta';

function ArticleRow({ article }: { article: Article }): React.ReactElement {
  const readingTime = timeToRead(article.wordCount);

  const trackingData = {
    articleId: article.id,
    title: article.title,
    readingTime,
    subscribersOnly: article.subscribersOnly,
    publishedAt: article.publishedAt,
  }

  return (
    <div className="border border-gray-300 rounded-sm my-4 space-y-2 p-4 flex flex-col md:flex-row justify-between items-center">
      <div className="w-full md:w-2/3">
        <Link href={`/analytics/${article.id}`}>
          <a
            className="text-3xl font-serif flex items-center hover:text-primary hover:cursor-pointer transition duration-150 ease-in-out"
            onClick={(): void => window.analytics.track('ARTICLE ANALYTICS ROW: Article title clicked', trackingData)}
          >
            {article.title}
            {
              article.subscribersOnly && (
                <span className="text-2xl uppercase tracking-widest text-primary px-2 py-1 font-sans">
                  <FiFeather />
                </span>
              )
            }
          </a>
        </Link>

        <div className="text-lg w-full mb-4">
          {article?.summary}
        </div>

        <div className="text-xs relative">
          <DateMeta
            resource={article}
            action={'Published'}
            dateParam={'publishedAt'}
          />
          
          <span className="hidden sm:inline-block">
            &nbsp;| {readingTime}
          </span>

          <div className="block sm:hidden">
            {readingTime}
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center space-x-4 w-full md:w-1/2">
        <div className="text-center bg-gray-50 w-1/3 py-4 rounded-sm">
          <div className="font-serif text-4xl">
            {article?.analytics?.totalViews || 0}
          </div>

          <div>
            Views
          </div>
        </div>

        <div className="text-center bg-gray-50 w-1/3 py-4 rounded-sm">
          <div className="font-serif text-4xl">
            {article?.analytics?.totalReads || 0}
          </div>

          <div>
            Reads
          </div>
        </div>

        <div className="text-center bg-gray-50 w-1/3 py-4 rounded-sm">
          <div className="font-serif text-4xl">
            {article?.analytics?.totalComments || 0}
          </div>

          <div>
            Comments
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleRow;
