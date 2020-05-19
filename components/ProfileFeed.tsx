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
import GenericError from './GenericError';
import FeedCollectionInfo from './FeedCollectionInfo';

function Activity({ activity }: { activity: FeedActivity }): React.ReactElement {
  const auth = useAuth();
  const { actor, time, object, verb } = activity;
 
  const actorName = actor.lastName ? `${actor.firstName} ${actor.lastName}` : actor.lastName;
  const action = verb === 'commented' ? 'commented on' : verb;

  const collectedArticle = object?.__typename === 'Collection' && verb === 'collected'
    ? object?.articles?.find(article => {
      if (activity.collectedArticle?.length && activity.collectedArticle[0]) {
        return article?.id === activity.collectedArticle[0];
      }

      return false;
    })
    : null;

  return (
    <div className="rounded-sm p-5 border border-gray-300 my-4">
      <div>
        <div>
          {
            auth?.userId === actor.id
              ? 'You'
              : (
                <Link href={`/${actor.username}`}>
                  <a
                    className="font-bold"
                    onClick={(): void => window.analytics.track('FEED COMMENT INFO: Resource title clicked', { actor: { id: actor.id } })}
                  >
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

          {
            object?.__typename === 'Collection' && action === 'collected' && (
              <>
                an article in <FeedCollectionInfo collection={object} />
              </>
            )
          }

          {
            object?.__typename === 'Collection' && action === 'created' && (
              <>
                a new collection called <FeedCollectionInfo collection={object} />
              </>
            )
          }
        </div>

        <div className="text-xs">
          {formatPretty(zonedTimeToUtc(time, timezoneOffset.toString()).toString())}
        </div>
      </div>

      {
        object?.__typename === 'Article' && (
          <div key={activity.id} className="mt-4 mx-auto w-1/2">
            <ArticleCard article={activity.object as Article} noTrim />
          </div>
        )
      }

      {
        object?.__typename === 'Comment' && (
          <div className="mt-4 border-l-2 border-primary bg-gray-100 text-md">
            <CommentEditor
              resourceId={object.resourceId}
              initialValue={JSON.parse(object.message)}
              readOnly={true}
              commentId={object.id}
            />
          </div>
        )
      }

      {
        object?.__typename === 'Collection' && action === 'collected' && collectedArticle && (
          <div key={activity.id} className="mt-4 mx-auto w-1/2">
            <ArticleCard article={collectedArticle as Article} noTrim />
          </div>
        )
      }
    </div>
  );
}

function ProfileFeed({ userId, name }: { userId: string; name: string }): React.ReactElement {
  const { loading, error, data } = useQuery(ProfileFeedQuery, { variables: { userId } });

  if (loading) return <FeedFallback />;

  if (error) return <div><GenericError title error={error} /></div>;

  const { profileFeed } = data;

  if (!profileFeed?.results.length) {
    return (
      <EmptyState title={"It's awfully quiet in here."}>
        <div>
          When {name} reads, posts, or comments, you&apos;ll see it here.
        </div>
      </EmptyState>
    )
  }

  return (
    <div className="py-5 container mx-auto relative">
      {profileFeed.results.map((feedActivity: FeedActivity) => <Activity key={feedActivity.id} activity={feedActivity} />)}
    </div>
  );
}

export default ProfileFeed;
