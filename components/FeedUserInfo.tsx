import Link from 'next/link';

import { User } from '../generated/graphql';

import { useAuth } from '../hooks/useAuth';

function FeedUserInfo({
  user,
}: {
  user: User;
}): React.ReactElement {
  const auth = useAuth();
  const isUser = auth.userId === user.id;

  return (
    <>
      {
        isUser
          ? 'you'
          : (
            <Link href={`/${user.username}`}>
              <a
                className="font-bold"
                onClick={(): void => window.analytics.track('FEED USER INFO: User clicked', { user, isUser })}
              >
                {user.firstName} {user?.lastName}
              </a>
            </Link>
          )
      }
    </>
  );
}

export default FeedUserInfo;
