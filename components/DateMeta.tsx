import { useState } from 'react';
import styled from '@emotion/styled';
import { isWithinInterval, subMinutes, addMinutes } from 'date-fns';

import { formatPretty } from '../lib/dates';

import { Comment, Article } from '../generated/graphql';

import Tooltip from './Tooltip';

type CommentDateMetaContainerProps = {
  edited: boolean;
}

const CommentDateMetaContainer = styled.span`
  text-decoration-style: ${(props: CommentDateMetaContainerProps): string => props.edited ? 'dashed' : 'none'};
`;

const DateMeta = ({
  resource,
  action = 'commented',
  dateParam = 'createdAt',
}: {
  resource: Comment | Article;
  action?: string;
  dateParam?: string;
}): React.ReactElement => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const mainDate = resource[dateParam];

  // Check to see if the updatedAt time is close to the created/published time
  const edited = !isWithinInterval(new Date(resource.updatedAt), {
    start: subMinutes(new Date(mainDate), 1),
    end: addMinutes(new Date(mainDate), 1),
  });
  const [showEditedAt, setShowEditedAt] = useState(false);

  return (
    <>
      <CommentDateMetaContainer
        id={`resource-${resource.id}-edited-at`}
        edited={edited}
        className={`${edited && 'underline'} relative`}
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
        {action} {formatPretty(mainDate, !action)}
      </CommentDateMetaContainer>

      <Tooltip
        showTooltip={showEditedAt}
        selector={`#resource-${resource.id}-edited-at`}
      >
        Edited {formatPretty(resource.updatedAt)}
      </Tooltip>
    </>
  );
}

export default DateMeta;
