import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import { User } from '../generated/graphql';

import BecomeSupporterButton from './BecomeSupporterButton';
import FollowButton from './FollowButton';

function AuthorSupport({
  author,
}: {
  author:  User;
}): React.ReactElement {
  const auth = useAuth();
  const router = useRouter();
  const { support } = router.query;
  const isSubscriber = author?.subscribers?.some(subscriber => subscriber === auth?.userId);
  const displaySupport = author?.stripeUserId && author?.stripePlan && !isSubscriber;

  return (
    <>
      {
        displaySupport
          ? (
            <BecomeSupporterButton
              author={author}
              displayModal={!!support}
            />
          )
          : (
            <FollowButton
              user={author}
              follower={auth.userId || ''}
            />
          )
      }
    </>
  );
}

export default AuthorSupport;
