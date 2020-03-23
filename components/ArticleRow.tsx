
import { useRef } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FiCopy } from 'react-icons/fi';
import ReactTooltip from 'react-tooltip';

import { Article } from '../generated/graphql';

function ArticleRow({ article }: { article: Article }): React.ReactElement {
  const copyIcon = useRef(null);

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
                <a className="text-3xl font-serif flex items-center hover:text-primary hover:cursor-pointer transition duration-150 ease-in-out">
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
          { article?.publishedAt ? `Published ${formatDistanceToNow(new Date(article.updatedAt))} ago | ` : ''}
          Updated {formatDistanceToNow(new Date(article.updatedAt))} ago
        </div>
      </div>

      <div className="flex justify-end items-center">
        {
          !article?.draft && article?.slug &&
          (
            <span
              ref={copyIcon}
              data-for="copied-tooltip"
              data-tip="Copied!"
              onClick={(): void => {
                navigator.clipboard.writeText(`https://getbard.com/articles/s/${article.slug}`);
                const el = copyIcon?.current || undefined;
                setTimeout(() => ReactTooltip.hide(el), 2000);
              }}
            >
              <FiCopy className="block hover:cursor-pointer hover:text-primary mr-4 transition duration-150 ease-in-out" />
              <ReactTooltip id="copied-tooltip" event="click" isCapture />
            </span>
          )
        }

        <Link href={`/edit/${article.id}`}>
          <a className="inline hover:text-primary hover:cursor-pointer font-medium mr-4 transition duration-150 ease-in-out">
            Edit
          </a>
        </Link>

        <div className="inline text-red-600 hover:text-red-900 hover:cursor-pointer font-medium transition duration-150 ease-in-out">Delete</div>
      </div>
    </div>
  );
}

export default ArticleRow;
