import { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';

import { useAuth } from '../hooks/useAuth';

import { Comment } from '../generated/graphql';

import CommentsByResourceIdQuery from '../queries/CommentsByResourceIdQuery';

import CommentEditor from './CommentEditor';
import CommentRow from './CommentRow';

function Comments({
  resourceId,
}: {
  resourceId: string;
} ): React.ReactElement {
  const auth = useAuth();
  const { loading, error, data, refetch } = useQuery(CommentsByResourceIdQuery, { variables: { resourceId } });
  const [sortBy, setSortBy] = useState('latest');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong...</div>;

  const { commentsByResourceId } = data;

  const changeSort = (): void => {
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
              <Link href="/href">
                <a className="underline">
                  Login to comment on this article
                </a>
              </Link>
            </div>
          )
      }

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
    </div>
  );
}

export default Comments;
