import { useMutation, useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import { User } from '../generated/graphql';
import FollowUserMutation from '../queries/FollowUserMutation';
import UnfollowUserMutation from '../queries/UnfollowUserMutation';
import UserFollowQuery from '../queries/UserFollowQuery';

import Button from './Button';
import Notification from './Notification';

function FollowButton({
  className,
  user,
  follower,
}: {
  user: User;
  follower: string;
  className?: string;
}): React.ReactElement {
  const router = useRouter();
  const auth = useAuth();
  const { data } = useQuery(UserFollowQuery, {
    variables: { username: user.username },
    fetchPolicy: 'cache-and-network',
  });
  const followerIds = data?.user?.followerIds || [];
  
  const [followUser, { error: followError }] = useMutation(FollowUserMutation, {
    update(cache) {
      cache.writeQuery({
        query: UserFollowQuery,
        variables: { username: user.username },
        data: {
          user: {
            ...data.user,
            followerIds: [...followerIds, follower],
          },
        },
      });
    }
  });

  const [unfollowUser, { error: unfollowError }] = useMutation(UnfollowUserMutation, {
    update(cache) {
      cache.writeQuery({
        query: UserFollowQuery,
        variables: { username: user.username },
        data: {
          user: {
            ...data.user,
            followerIds: followerIds.filter((followerId: string) => followerId !== follower),
          },
        },
      });
    }
  });
  const isFollower = followerIds?.includes(follower);

  const trackingData = {
    userId: user.id,
    follower,
  };

  const handleFollow = (): void => {
    if (!auth.userId) {
      window.analytics.track('FOLLOW BUTTON: Follow clicked; Redirect to login', trackingData);
      router.push(`/login?redirect=${router.asPath}`);
      return;
    }

    if (isFollower) {
      window.analytics.track('FOLLOW BUTTON: Unfollow clicked', trackingData);
      unfollowUser({ variables: { input: { userId: user.id } } });
    } else {
      window.analytics.track('FOLLOW BUTTON: Follow clicked', trackingData);
      followUser({ variables: { input: { userId: user.id } } });
    }
  }

  return (
    <>
      <Button
        secondary
        className={className}
        onClick={handleFollow}
      >
        {isFollower ? 'Unfollow' : 'Follow'}
      </Button>

      <Notification
        showNotification={!!followError || !!unfollowError}
        error={followError || unfollowError}
      />
    </>
  );
}

export default FollowButton;
