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
    <div className="flex justify-end items-center">
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
              className="mr-2"
              user={author}
              follower={auth.userId || ''}
            />
          )
      }
    </div>
  );
}

export default AuthorSupport;
