import { useState } from 'react';
import Link from 'next/link';

import { useAuth } from '../hooks/useAuth';

import { Comment } from '../generated/graphql';

import CommentEditor from './CommentEditor';
import Button from './Button';
import CommentDateMeta from './CommentDateMeta';
import ReplyRow from './ReplyRow';

const CommentRow = ({
  comment,
  refetch,
}: {
  comment: Comment;
  refetch: () => void;
}): React.ReactElement => {
  const auth = useAuth();
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const commentorName = `${comment.user.firstName}${comment.user?.lastName && ' ' + comment.user.lastName}`;

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
            <div className="m-2 border border-gray-300">
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
              <div className="relative">
                <Link href={`/${comment.user.username}`} ><a className="underline">{commentorName}</a></Link>
                &nbsp;
                <CommentDateMeta comment={comment} />
              </div>

              <div className="flex">
                {
                  auth.userId && auth.userId === comment.user.id && (
                    <div>
                      <Button text onClick={(): void => setReadOnly(false)} >
                        Edit
                      </Button>

                      <Button text onClick={(): void => setShowReplyEditor(true)}>
                        Delete
                      </Button>
                    </div>
                  )
                }

                {
                  auth.userId
                    ? (
                      <Button text onClick={(): void => setShowReplyEditor(true)}>
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
              return <ReplyRow key={reply.id || ''} reply={reply} />;
            })}
          </div>
        )
      }
    </div>
  );
}

export default CommentRow;
