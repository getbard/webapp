import { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import { Comment } from '../generated/graphql';

import CommentsByResourceIdQuery from '../queries/CommentsByResourceIdQuery';

import CommentEditor from './CommentEditor';
import CommentRow from './CommentRow';
import CommentsFallback from './CommentsFallback';
import GenericError from './GenericError';

function Comments({
  resourceId,
}: {
  resourceId: string;
}): React.ReactElement {
  const auth = useAuth();
  const router = useRouter();
  const { loading, error, data, refetch } = useQuery(CommentsByResourceIdQuery, { variables: { resourceId } });
  const [sortBy, setSortBy] = useState('latest');

  if (loading) return <CommentsFallback />;

  if (error) return (
    <div className="mt-10 w-full border border-gray-300 rounded-sm p-4 shadow-sm">
      <h2 className="mb-2 font-bold">
        We weren&apos;t able to get comments for this article.
      </h2>

      <p>
        Rest assured, we&apos;re on it! Check back in a little bit.
      </p>
    </div>
  );

  const { commentsByResourceId } = data;

  const changeSort = (): void => {
    window.analytics.track('COMMENT: Change sort clicked', { sortBy });
    setSortBy(sortBy === 'latest' ? 'oldest' : 'latest');
  }

  return (
    <div className="mt-10">
      {
        auth.userId
          ? (
            <div className="border border-gray-300 rounded-sm">
              <CommentEditor resourceId={resourceId} refetch={refetch} />
            </div>
          )
          : (
            <div className="text-center p-16 border border-gray-300 rounded-sm">
              <Link href={`/login?redirect=${router.asPath}`}>
                <a className="underline">
                  Login to comment on this article
                </a>
              </Link>
            </div>
          )
      }

      {
        commentsByResourceId.length
          ? (
            <div className="mt-4">
              <div className="text-xs">
                Showing <span className="underline hover:text-primary hover:cursor-pointer" onClick={changeSort}>
                  {sortBy}
                </span> comments first
              </div>
      
              {commentsByResourceId.sort((a: Comment, b: Comment) => {
                const aCreatedAt = new Date(a.createdAt);
                const bCreatedAt = new Date(b.createdAt);
      
                if (sortBy === 'latest') {
                  return bCreatedAt.getTime() - aCreatedAt.getTime();
                } else {
                  return aCreatedAt.getTime() - bCreatedAt.getTime();
                }
              }).map((comment: Comment) => {
                return <CommentRow key={comment.id || ''} comment={comment} refetch={refetch} />;
              })}
            </div>
          )
          : (
            <div className="pt-5 text-center">
              No one has commented on this article. {auth.userId && 'Be the first to start a discussion!'}
            </div>
          )
      }
    </div>
  );
}

export default Comments;
