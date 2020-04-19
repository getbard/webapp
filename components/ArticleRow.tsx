
import { useState } from 'react';
import Link from 'next/link';
import { FiCopy, FiFeather } from 'react-icons/fi';
import { useMutation } from '@apollo/react-hooks';

import { useAuth } from '../hooks/useAuth';

import { Article } from '../generated/graphql';
import DeleteArticleMutation from '../queries/DeleteArticleMutation';

import { timeToRead } from '../lib/editor';
import Tooltip from './Tooltip';
import Notification from './Notification';
import DateMeta from './DateMeta';

function ArticleRow({ article, refetch }: { article: Article; refetch: () => void }): React.ReactElement {
  const auth = useAuth();
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const articleOwner = auth.userId === article.userId;
  const readingTime = timeToRead(article.wordCount);

  const [deleteArticle, { error }] = useMutation(DeleteArticleMutation, {
    update() {
      refetch();
    }
  });

  const trackingData = {
    article: {
      id: article.id,
      title: article.title,
      slug: article.slug,
      readingTime,
      subscribersOnly: article.subscribersOnly,
      category: article.category,
    },
    author: {
      id: article.author.id,
    }
  }

  const handleDelete = (): void => {
    window.analytics.track('ARTICLE ROW: Delete clicked', trackingData);
    const deleteConfirmed = confirm('Are you sure you want to delete this article?');

    if (deleteConfirmed) {
      window.analytics.track('ARTICLE ROW: Delete confirm clicked', trackingData);
      deleteArticle({ variables: { input: { id: article.id } } });
    }
  }

  return (
    <div className="border border-gray-300 rounded-sm shadow-sm my-2 p-4 flex justify-between items-center">
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
                <a
                  className="text-3xl font-serif flex items-center hover:text-primary hover:cursor-pointer transition duration-150 ease-in-out"
                  onClick={(): void => window.analytics.track('ARTICLE ROW: Article title clicked', trackingData)}
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
            )
        }

        <div className="text-lg w-full mb-4">
          {article?.summary}
        </div>

        <div className="text-xs relative">
          <DateMeta
            resource={article}
            action={article?.publishedAt ? 'Published' : 'Created'}
            dateParam={article?.publishedAt ? 'publishedAt' : 'createdAt'}
          /> | {readingTime}
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
                  window.analytics.track('ARTICLE ROW: Copy article clicked', trackingData);
                  navigator.clipboard.writeText(`https://getbard.com/articles/s/${article.slug}`);
                  setShowCopiedTooltip(true);
                  setTimeout(() => setShowCopiedTooltip(false), 2500);
                }}
              >
                <FiCopy className="block hover:cursor-pointer hover:text-primary mr-4 transition duration-150 ease-in-out" />
                <Tooltip showTooltip={showCopiedTooltip} selector={`#a-${article.id}-copy`} top="-3.5" pos="right-0">
                  A link to the article has been <br/>
                  copied to your clipboard.
                </Tooltip>
              </span>
            )
          }

          <Link href={`/edit/${article.id}`}>
            <a
              className="inline text-primary hover:underline hover:cursor-pointer mr-4 transition duration-150 ease-in-out"
              onClick={(): void => window.analytics.track('ARTICLE ROW: Edit clicked', trackingData)}
            >
              Edit
            </a>
          </Link>

          <div
            className="inline text-primary hover:underline hover:cursor-pointer transition duration-150 ease-in-out"
            onClick={handleDelete}
          >
            Delete
          </div>

          <Notification showNotification={!!error} error={error} />
        </div>
      )}
      </div>
  );
}

export default ArticleRow;
