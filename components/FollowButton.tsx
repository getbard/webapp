import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import { User } from '../generated/graphql';
import AuthorProfileQuery from '../queries/AuthorProfileQuery';
import FollowUserMutation from '../queries/FollowUserMutation';
import UnfollowUserMutation from '../queries/UnfollowUserMutation';

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

  const [followUser, { error: followError }] = useMutation(FollowUserMutation, {
    update(cache) {
      const userFollowers = user?.followerIds || [];
      cache.writeQuery({
        query: AuthorProfileQuery,
        variables: { username: user.username },
        data: {
          user: {
            ...user,
            followerIds: [...userFollowers, follower],
          },
        },
      });
    }
  });

  const [unfollowUser, { error: unfollowError }] = useMutation(UnfollowUserMutation, {
    update(cache) {
      const data: any = cache.readQuery({
        query: AuthorProfileQuery,
        variables: { username: user.username },
      });
      cache.writeQuery({
        query: AuthorProfileQuery,
        data: {
          user: {
            ...data.user,
            followerIds: data.user.followerIds.filter((followerId: string) => followerId !== follower),
          },
        },
      });
    }
  });
  const isFollower = user.followerIds?.includes(follower);

  const trackingData = {
    user,
    follower,
  }

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
