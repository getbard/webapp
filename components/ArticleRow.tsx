
import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FiCopy, FiFeather } from 'react-icons/fi';
import { useMutation } from '@apollo/react-hooks';

import { useAuth } from '../hooks/useAuth';

import { Article } from '../generated/graphql';
import DeleteArticleMutation from '../queries/DeleteArticleMutation';

import { timeToRead } from '../lib/editor';
import Tooltip from './Tooltip';
import Notification from './Notification';

function ArticleRow({ article, refetch }: { article: Article; refetch: () => void }): React.ReactElement {
  const auth = useAuth();
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const articleOwner = auth.user?.uid === article.userId;
  const [deleteArticle, { data, called, error }] = useMutation(DeleteArticleMutation, {
    update() {
      refetch();
    }
  });

  const handleDelete = (): void => {
    deleteArticle({ variables: { input: { id: article.id } } });
  }

  return (
    <div className="border-b border-gray-200 my-2 py-4 flex justify-between items-center">
      <div>
        {
          !article.publishedAt
            ? (
              <div className="text-3xl font-serif flex items-center">
                {article.title}
                {
                  article.subscribersOnly && (
                    <span className="text-2xl uppercase tracking-widest text-primary px-2 py-1 font-sans">
                      <FiFeather />
                    </span>
                  )
                }
              </div>
            )
            : (
              <Link href={`/articles/i/${article.id}`}>
                <a className="text-3xl font-serif flex items-center hover:text-primary hover:cursor-pointer transition duration-150 ease-in-out">
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
            )
        }

        <div className="text-lg w-full mb-4">
          {article?.summary}
        </div>

        <div className="text-xs">
          {timeToRead(article.wordCount)}
        </div>

        <div className="text-xs">
          { article?.publishedAt ? `Published ${formatDistanceToNow(new Date(article.updatedAt))} ago | ` : ''}
          Updated {formatDistanceToNow(new Date(article.updatedAt))} ago
        </div>
      </div>

      {articleOwner && (
        <div className="flex justify-end items-center">
          {
            article?.publishedAt && article?.slug &&
            (
              <span
                id={`a-${article.id}-copy`} 
                className="relative"
                onClick={(): void => {
                  navigator.clipboard.writeText(`https://getbard.com/articles/s/${article.slug}`);
                  setShowCopiedTooltip(true);
                  setTimeout(() => setShowCopiedTooltip(false), 2500);
                }}
              >
                <FiCopy className="block hover:cursor-pointer hover:text-primary mr-4 transition duration-150 ease-in-out" />
                <Tooltip showTooltip={showCopiedTooltip} selector={`#a-${article.id}-copy`}>
                  A link to the article has been <br/>
                  copied to your clipboard.
                </Tooltip>
              </span>
            )
          }

          <Link href={`/edit/${article.id}`}>
            <a className="inline hover:text-primary hover:cursor-pointer font-medium mr-4 transition duration-150 ease-in-out">
              Edit
            </a>
          </Link>

          <div
            className="inline text-red-600 hover:text-red-900 hover:cursor-pointer font-medium transition duration-150 ease-in-out"
            onClick={handleDelete}
          >
            Delete
          </div>
          <Notification showNotification={(data && called) || !!error} error={error}>
            Deleted
          </Notification>
        </div>
      )}
      </div>
  );
}

export default ArticleRow;
