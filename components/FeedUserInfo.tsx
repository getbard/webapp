import Link from 'next/link';

import { Article, User } from '../generated/graphql';

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
              <a className="font-bold">
                {user.firstName} {user?.lastName}
              </a>
            </Link>
          )
      }
    </>
  );
}

export default FeedUserInfo;
