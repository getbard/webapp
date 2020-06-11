
import Link from 'next/link';
import { FiFeather } from 'react-icons/fi';
import { useMutation } from '@apollo/react-hooks';

import { useAuth } from '../hooks/useAuth';

import { Article } from '../generated/graphql';
import DeleteArticleMutation from '../queries/DeleteArticleMutation';

import { timeToRead } from '../lib/editor';
import Notification from './Notification';
import DateMeta from './DateMeta';
import ShareArticleButton from './ShareArticleButton';

function ArticleRow({ article, refetch }: { article: Article; refetch: () => void }): React.ReactElement {
  const auth = useAuth();
  const articleOwner = auth.userId === article.userId;
  const readingTime = timeToRead(article.wordCount);
  const articleTitleUrl = article.publishedAt ? `/articles/i/${article.id}` : `/edit/${article.id}`;

  const [deleteArticle, { error }] = useMutation(DeleteArticleMutation, {
    update() {
      refetch();
    }
  });

  const trackingData = {
    articleId: article.id,
    title: article.title,
    slug: article.slug,
    readingTime,
    subscribersOnly: article.subscribersOnly,
    category: article.category,
    authorId: article.userId,
    publishedAt: article.publishedAt,
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
    <div className="border border-gray-300 rounded-sm my-4 p-4 flex justify-between items-center">
      <div>
        <Link href={articleTitleUrl}>
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

        <div className="text-lg w-full mb-4">
          {article?.summary}
        </div>

        <div className="text-xs relative">
          <DateMeta
            resource={article}
            action={article?.publishedAt ? 'Published' : 'Created'}
            dateParam={article?.publishedAt ? 'publishedAt' : 'createdAt'}
          />
          
          <span className="hidden sm:inline-block">
            &nbsp;| {readingTime}
          </span>

          <div className="block sm:hidden">
            {readingTime}
          </div>
        </div>
      </div>

        <div className="flex justify-end items-center space-x-4">
          <ShareArticleButton article={article} minimal />

          {articleOwner && (
            <>
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
            </>
          )}
        </div>
      </div>
  );
}

export default ArticleRow;
