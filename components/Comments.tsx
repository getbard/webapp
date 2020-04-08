import { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { format } from 'date-fns';
import Link from 'next/link';

import { Comment } from '../generated/graphql';

import CommentsByResourceIdQuery from '../queries/CommentsByResourceIdQuery';

import CommentEditor from './CommentEditor';
import Button from './Button';

const ReplyRow = ({ reply }: { reply: Comment }): React.ReactElement => {
  const replierName = `${reply.user?.firstName}${reply.user?.lastName && ' ' + reply.user.lastName}`;

  return (
    <div className="border bg-white border-gray-300 rounded mt-4">
      <CommentEditor
        resourceId={reply.resourceId}
        initialValue={JSON.parse(reply.message)}
        readOnly
      />

      <div className="p-2 border-t border-gray-300">
        <Link href={`/${reply.user.username}`}><a className="underline">{replierName}</a></Link>
        &nbsp;replied on {format(new Date(reply.createdAt), 'MMM do, yyyy')}
      </div>
    </div>
  );
}

const CommentRow = ({
  comment,
  refetch,
}: {
  comment: Comment;
  refetch: () => void;
}): React.ReactElement => {
  const [isReply, setIsReply] = useState(false);
  const commentorName = `${comment.user.firstName}${comment.user?.lastName && ' ' + comment.user.lastName}`;

  return (
    <div className="mt-2 border border-gray-300 rounded-sm">
      <CommentEditor
        resourceId={comment.resourceId}
        initialValue={JSON.parse(comment.message)}
        readOnly
      />

      {
        isReply
        ? (
          <div className="m-2 border border-gray-300">
            <CommentEditor
              refetch={refetch}
              resourceId={comment.resourceId}
              parentId={comment.id || ''}
            />
          </div>
        )
        : (
          <div className="flex items-center justify-between pl-4 pr-2 p-1 bg-gray-100 border-t border-gray-300">
            <div>
              <Link href={`/${comment.user.username}`} ><a className="underline">{commentorName}</a></Link>
              &nbsp;commented on {format(new Date(comment.createdAt), 'MMM do, yyyy')}
            </div>
    
            <div>
              <Button text onClick={(): void => setIsReply(true)}>
                Reply
              </Button>
            </div>
          </div>
        )
      }

      {
        (comment?.replies?.length || false) && (
          <div className="p-4 pt-0 border-t border-gray-300">
            {comment.replies.map((reply: Comment | null) => {
              if (!reply) return;
              return <ReplyRow key={reply.id || ''} reply={reply} />;
            })}
          </div>
        )
      }
    </div>
  );
}

function Comments({
  resourceId,
}: {
  resourceId: string;
} ): React.ReactElement {
  const { loading, error, data, refetch } = useQuery(CommentsByResourceIdQuery, { variables: { resourceId } });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong...</div>;

  const { commentsByResourceId } = data;

  return (
    <div className="mt-10">
      <div className="border border-gray-300 rounded-sm">
        <CommentEditor resourceId={resourceId} refetch={refetch} />
      </div>

      {commentsByResourceId.map((comment: Comment) => {
        return <CommentRow key={comment.id || ''} comment={comment} refetch={refetch} />;
      })}
    </div>
  );
}

export default Comments;
