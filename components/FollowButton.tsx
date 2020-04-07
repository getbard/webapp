import { useMutation } from '@apollo/react-hooks';

import { User } from '../generated/graphql';
import AuthorProfileQuery from '../queries/AuthorProfileQuery';
import FollowUserMutation from '../queries/FollowUserMutation';
import UnfollowUserMutation from '../queries/UnfollowUserMutation';

import Button from './Button';

function FollowButton({
  className,
  user,
  follower,
}: {
  user: User;
  follower: string;
  className?: string;
}): React.ReactElement {
  const [followUser, { loading: followLoading }] = useMutation(FollowUserMutation, {
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
            followerIds: [...data.user.followerIds, follower],
          },
        },
      });
    }
  });
  const [unfollowUser, { loading: unfollowLoading }] = useMutation(UnfollowUserMutation, {
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

  const handleFollow = (): void => {
    if (isFollower) {
      unfollowUser({ variables: { input: { userId: user.id } } });
    } else {
      followUser({ variables: { input: { userId: user.id } } });
    }
  }

  return (
    <>
      <Button
        secondary
        className={className}
        onClick={handleFollow}
        loading={followLoading || unfollowLoading}
      >
        {isFollower ? 'Unfollow' : 'Follow'}
      </Button>
    </>
  );
}

export default FollowButton;
