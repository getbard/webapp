import { useState } from 'react';
import Link from 'next/link';

import { useAuth } from '../hooks/useAuth';

import { Comment } from '../generated/graphql';

import CommentEditor from './CommentEditor';
import Button from './Button';
import CommentDateMeta from './CommentDateMeta';

const ReplyRow = ({ reply }: { reply: Comment }): React.ReactElement => {
  const auth = useAuth();
  const [readOnly, setReadOnly] = useState(true);
  const replierName = `${reply.user?.firstName}${reply.user?.lastName && ' ' + reply.user.lastName}`;

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

              <Button text>
                Delete
              </Button>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default ReplyRow;
