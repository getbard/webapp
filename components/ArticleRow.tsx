
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

import { Article } from '../generated/graphql';

function ArticleRow({ article }: { article: Article }): React.ReactElement {
  return (
    <div className="border-b border-gray-200 my-2 py-4 flex justify-between items-center">
      <div>
        {
          article.draft
            ? (
              <div className="text-3xl font-serif flex items-center">
                {article.title}
                  &nbsp;{article.subscribersOnly && <span className="text-xs uppercase tracking-widest bg-primary rounded-full text-white px-2 py-1 font-sans">Premium</span>}
              </div>
            )
            : (
              <Link href={`/articles/i/${article.id}`}>
                <a className="text-3xl font-serif flex items-center hover:text-primary hover:cursor-pointer">
                  {article.title}
                    &nbsp;{article.subscribersOnly && <span className="text-xs uppercase tracking-widest bg-primary rounded-full text-white px-2 py-1 font-sans">Premium</span>}
                </a>
              </Link>
            )
        }

        <div className="text-lg w-full mb-4">
          {article?.summary}
        </div>

        <div className="text-xs">
          Updated {formatDistanceToNow(new Date(article.updatedAt))} ago
          </div>
      </div>

      <div>
        <div className="inline hover:text-primary hover:cursor-pointer font-medium mr-4">Edit</div>
        <div className="inline text-red-600 hover:text-red-900 hover:cursor-pointer font-medium">Delete</div>
      </div>
    </div>
  );
}

export default ArticleRow;
