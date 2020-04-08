import { useState } from 'react';
import styled from '@emotion/styled';

import { formatPretty } from '../lib/dates';

import { Comment } from '../generated/graphql';

import Tooltip from './Tooltip';

type CommentDateMetaContainerProps = {
  edited: boolean;
}

const CommentDateMetaContainer = styled.span`
  text-decoration-style: ${(props: CommentDateMetaContainerProps): string => props.edited ? 'dashed' : 'none'};
`;

const CommentDateMeta = ({
  comment,
  action = 'commented',
}: {
  comment: Comment;
  action?: string;
}): React.ReactElement => {
  const edited = comment.createdAt !== comment.updatedAt;
  const [showEditedAt, setShowEditedAt] = useState(false);

  return (
    <>
      <CommentDateMetaContainer
        id={`comment-${comment.id}-edited-at`}
        edited={edited}
        className={`${edited && 'underline'}`}
        onMouseEnter={(): void => {
          if (edited) {
            setShowEditedAt(true);
          }
        }}
        onMouseLeave={(): void => {
          if (edited) {
            setShowEditedAt(false);
          }
        }}
      >
        {action} {formatPretty(comment.createdAt)}
      </CommentDateMetaContainer>
      <Tooltip
        showTooltip={showEditedAt}
        selector={`#comment-${comment.id}-edited-at`}
      >
        Edited {formatPretty(comment.updatedAt)}
      </Tooltip>
    </>
  );
}

export default CommentDateMeta;
