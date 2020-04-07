import { useMutation } from '@apollo/react-hooks';

import { User } from '../generated/graphql';

import FollowUserMutation from '../queries/FollowUserMutation';
import UnfollowUserMutation from '../queries/UnfollowUserMutation';

import Button from './Button';

function FollowButton({
  className,
  user,
  follower,
  refetch,
}: {
  user: User;
  follower: string;
  className?: string;
  refetch?: () =>  void;
}): React.ReactElement {
  const [followUser, { loading: followLoading }] = useMutation(FollowUserMutation);
  const [unfollowUser, { loading: unfollowLoading }] = useMutation(UnfollowUserMutation);
  const isFollower = user.followerIds?.includes(follower);

  const handleFollow = (): void => {
    if (isFollower) {
      unfollowUser({ variables: { input: { userId: user.id } } });
    } else {
      followUser({ variables: { input: { userId: user.id } } });
    }

    if (refetch && !followLoading && !unfollowLoading) {
      console.log('refetch!');
      refetch();
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
