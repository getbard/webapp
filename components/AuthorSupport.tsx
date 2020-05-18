import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import { User, Article } from '../generated/graphql';

import BecomeSupporterButton from './BecomeSupporterButton';
import OneTimeSupportButton from './OneTimeSupportButton';
import FollowButton from './FollowButton';
import ShareArticleButton from './ShareArticleButton';

function AuthorSupport({
  article,
  articleTrackingData,
}: {
  article: Article;
  articleTrackingData: any;
}): React.ReactElement {
  const auth = useAuth();
  const router = useRouter();
  const { support } = router.query;
  const authorName = `${article.author.firstName}${article.author?.lastName && ' ' + article.author.lastName}`;

  const handleAuthorClick = (): void => {
    window.analytics.track(`ARTICLE: author name clicked`, articleTrackingData);
  }

  return (
    <div className="text-center mt-10 p-10 bg-gray-100 border-t-2 border-gray-300">
      <div className="mb-4">
        <div>
          This article was written by&nbsp;

          <Link href={`/${article.author.username}`} >
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
        article.author.id !== auth.userId && (
          <div className="space-x-4">
            {article.author?.stripeUserId && article.author?.stripePlan && (
              <BecomeSupporterButton
                author={article.author}
                displayModal={!!support}
              />
            )}

              <FollowButton
                user={article.author}
                follower={auth.userId || ''}
              />

              {article.author?.stripeUserId && (
                <OneTimeSupportButton
                  stripeUserId={article.author?.stripeUserId || ''}
                  author={article.author}
                />
              )}

              <ShareArticleButton article={article} />
          </div>
        )
      }
    </div>
  );
}

export default AuthorSupport;
