import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/react-hooks';

import { useAuth } from '../hooks/useAuth';

import { Comment } from '../generated/graphql';
import DeleteCommentMutation from '../queries/DeleteCommentMutation';

import CommentEditor from './CommentEditor';
import Button from './Button';
import CommentDateMeta from './CommentDateMeta';
import Notification from './Notification';

const ReplyRow = ({
  reply,
  refetch,
}: {
  reply: Comment;
  refetch: () => void;
}): React.ReactElement => {
  const auth = useAuth();
  const [readOnly, setReadOnly] = useState(true);
  const replierName = auth.userId === reply.user.id
    ? 'You'
    : `${reply.user?.firstName}${reply.user?.lastName && ' ' + reply.user.lastName}`;
  const [deleteReply, { loading, called, error }] = useMutation(DeleteCommentMutation);

  // Refetch after a load 
  useEffect(() => {
    if (called && !loading) {
      refetch();
    }
  }, [loading]);

  const handleDeleteReply = (): void => {
    deleteReply({ variables: { input: { id: reply.id } } });
  }

  return (
    <div className="border bg-white border-gray-300 rounded mt-4">
      <CommentEditor
        resourceId={reply.resourceId}
        initialValue={JSON.parse(reply.message)}
        readOnly={readOnly}
        commentId={reply.id || ''}
        onSubmit={(): void => setReadOnly(true)}
      />

      <div className="px-4 py-1 border-t border-gray-300 flex justify-between items-center">
        <div className="relative">
          <Link href={`/${reply.user.username}`}><a className="underline">{replierName}</a></Link>
          &nbsp;
          <CommentDateMeta comment={reply} action="replied" />
        </div>

        {
          auth.userId && auth.userId === reply.user.id && (
            <div>
              <Button text onClick={(): void => setReadOnly(false)}>
                Edit
              </Button>

              <Button text onClick={handleDeleteReply}>
                Delete
              </Button>
            </div>
          )
        }
      </div>

      <Notification
        showNotification={false}
        error={error}
      />
    </div>
  );
}

export default ReplyRow;
