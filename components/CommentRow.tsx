import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/react-hooks';

import { useAuth } from '../hooks/useAuth';
import useOnClickOutside from '../hooks/useOnClickOutside';

import { Comment } from '../generated/graphql';
import DeleteCommentMutation from '../queries/DeleteCommentMutation';

import CommentEditor from './CommentEditor';
import Button from './Button';
import DateMeta from './DateMeta';
import ReplyRow from './ReplyRow';
import Notification from './Notification';

const CommentRow = ({
  comment,
  refetch,
}: {
  comment: Comment;
  refetch: () => void;
}): React.ReactElement => {
  const auth = useAuth();
  const replyEditorRef = useRef(null);
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const commentorName = auth.userId === comment.user.id
    ? 'You'
    : `${comment.user.firstName}${comment.user?.lastName && ' ' + comment.user.lastName}`;
  const [deleteComment, { loading, called, error }] = useMutation(DeleteCommentMutation);

  // Refetch after a load 
  useEffect(() => {
    if (called && !loading) {
      refetch();
    }
  }, [loading]);

  useOnClickOutside(replyEditorRef, (): void => {
    setShowReplyEditor(false);
  });

  const handleDeleteComment = (): void => {
    window.analytics.track('COMMENT ROW: Delete clicked');
    deleteComment({ variables: { input: { id: comment.id } } });
  }

  return (
    <div className="mt-2 border border-gray-300 rounded-sm">
      <CommentEditor
        resourceId={comment.resourceId}
        initialValue={JSON.parse(comment.message)}
        readOnly={readOnly}
        commentId={comment.id || ''}
        onSubmit={(): void => setReadOnly(true)}
      />

      {
        showReplyEditor
          ? (
            <div
              ref={replyEditorRef}
              className="m-2 border border-gray-300"
            >
              <CommentEditor
                refetch={refetch}
                resourceId={comment.resourceId}
                parentId={comment.id || ''}
                onSubmit={(): void => setShowReplyEditor(false)}
              />
            </div>
          )
          : (
            <div className="flex items-center justify-between pl-4 pr-2 py-1 bg-gray-100 border-t border-gray-300">
              <div className="relative text-xs">
                <Link href={`/${comment.user.username}`} ><a className="underline">{commentorName}</a></Link>
                &nbsp;
                <DateMeta resource={comment} />
              </div>

              <div className="flex">
                {
                  auth.userId && auth.userId === comment.user.id && (
                    <div>
                      <Button
                        text
                        onClick={(): void => {
                          window.analytics.track('COMMENT ROW: Edit clicked');
                          setReadOnly(false);
                        }}
                      >
                        Edit
                      </Button>

                      <Button text onClick={handleDeleteComment}>
                        Delete
                      </Button>
                    </div>
                  )
                }

                {
                  auth.userId
                    ? (
                      <Button
                        text
                        onClick={(): void => {
                          window.analytics.track('COMMENT ROW: Reply clicked');
                          setShowReplyEditor(true);
                        }}
                      >
                        Reply
                      </Button>
                    )
                    : <div className="h-10"></div>
                }
              </div>
            </div>
          )
      }

      {
        (comment?.replies?.length || false) && (
          <div className="p-4 pt-0 border-t border-gray-300">
            {comment.replies.map((reply: Comment | null) => {
              if (!reply) return;
              return <ReplyRow key={reply.id || ''} reply={reply} refetch={refetch} />;
            })}
          </div>
        )
      }

      <Notification
        showNotification={false}
        error={error}
      />
    </div>
  );
}

export default CommentRow;
