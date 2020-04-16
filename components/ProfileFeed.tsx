import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { formatPretty } from '../lib/dates';
import { zonedTimeToUtc } from 'date-fns-tz';

const timezoneOffset = new Date().getTimezoneOffset();

import { useAuth } from '../hooks/useAuth';

import { FeedActivity, Article } from '../generated/graphql';

import ProfileFeedQuery from '../queries/ProfileFeedQuery';

import ArticleCard from './ArticleCard';
import CommentEditor from './CommentEditor';
import FeedCommentInfo from './FeedCommentInfo';
import FeedUserInfo from './FeedUserInfo';
import FeedFallback from './FeedFallback';
import EmptyState from './EmptyState';

function Activity({ activity }: { activity: FeedActivity }): React.ReactElement {
  const auth = useAuth();
  const { actor, time, object, verb } = activity;
  const actorName = actor.lastName ? `${actor.firstName} ${actor.lastName}` : actor.lastName;
  const action = verb === 'commented' ? 'commented on' : verb;

  return (
    <div className="rounded-sm p-5 border border-gray-300 my-4">
      <div>
        <div>
          {
            auth?.userId === actor.id
              ? 'You'
              : (
                <Link href={`/${actor.username}`}>
                  <a className="font-bold">
                    {actorName}
                  </a>
                </Link>
              )
          }

          &nbsp;{action}&nbsp;

          {
            object?.__typename === 'Article' && (
              <>
                an article
              </>
            )
          }

          {
            object?.__typename === 'Comment' && (
              <FeedCommentInfo actor={actor} resource={object.resource} />
            )
          }

          {
            object?.__typename === 'User' && (
              <FeedUserInfo user={object} />
            )
          }
        </div>

        <div className="text-xs">
          {formatPretty(zonedTimeToUtc(time, timezoneOffset.toString()).toString())}
        </div>
      </div>

      {
        object?.__typename === 'Article' && (
          <div key={activity.id} className="mt-4">
            <ArticleCard article={activity.object as Article} />
          </div>
        )
      }

      {
        object?.__typename === 'Comment' && (
          <div className="mt-4 border-l-2 border-primary bg-gray-100 text-md italic">
            <CommentEditor
              resourceId={object.resourceId}
              initialValue={JSON.parse(object.message)}
              readOnly={true}
              commentId={object.id}
            />
          </div>
        )
      }
    </div>
  );
}

function ProfileFeed({ userId }: { userId: string }): React.ReactElement {
  const { loading, error, data } = useQuery(ProfileFeedQuery, { variables: { userId } });

  if (error) return <div>Error</div>;
  if (loading) return <FeedFallback />;

  const { profileFeed } = data;

  if (!profileFeed?.results.length) {
    return (
      <EmptyState title={"It's awfully quiet in here."}>
        <div>
          When people you follow read, post, or comment, we&apos;ll let you know.
        </div>
      </EmptyState>
    )
  }

  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      {profileFeed.results.map((feedActivity: FeedActivity) => <Activity key={feedActivity.id} activity={feedActivity} />)}
    </div>
  );
}

export default ProfileFeed;
