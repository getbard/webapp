import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import { User } from '../generated/graphql';

import BecomeSupporterButton from './BecomeSupporterButton';
import OneTimeSupportButton from './OneTimeSupportButton';
import FollowButton from './FollowButton';

function AuthorSupport({
  author,
  articleTrackingData,
}: {
  author:  User;
  articleTrackingData: any;
}): React.ReactElement {
  const auth = useAuth();
  const router = useRouter();
  const { support } = router.query;
  const authorName = `${author.firstName}${author?.lastName && ' ' + author.lastName}`;

  const handleAuthorClick = (): void => {
    window.analytics.track(`ARTICLE: author name clicked`, articleTrackingData);
  }

  return (
    <div className="text-center mt-10 p-10 bg-gray-100 border-t-2 border-gray-300">
      <div className="mb-4">
        <div>
          This article was written by&nbsp;

          <Link href={`/${author.username}`} >
            <a
              className="underline font-bold"
              onClick={handleAuthorClick}
            >
              {authorName}
            </a>
          </Link>.
        </div>

        <div>
          Consider supporting them so they can create more quality content.
        </div>
      </div>

      {
        author.id !== auth.userId && (
          <div className="flex justify-center flex-col items-center">
            {author?.stripeUserId && author?.stripePlan && (
              <BecomeSupporterButton
                author={author}
                displayModal={!!support}
              />
            )}

            <div className="mt-2">
              <FollowButton
                className="mr-2"
                user={author}
                follower={auth.userId || ''}
              />

              {author?.stripeUserId && (
                <OneTimeSupportButton
                  stripeUserId={author?.stripeUserId || ''}
                  author={author}
                />
              )}
            </div>
          </div>
        )
      }
    </div>
  );
}

export default AuthorSupport;
