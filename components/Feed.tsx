import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { formatPretty } from '../lib/dates';

import { FeedItem, FeedActivity, Article } from '../generated/graphql';

import FeedQuery from '../queries/FeedQuery';

import ArticleCard from './ArticleCard';
import CommentEditor from './CommentEditor';
import FeedCommentInfo from './FeedCommentInfo';
import FeedUserInfo from './FeedUserInfo';

function Item({ item }: { item: FeedItem }): React.ReactElement {
  const { verb, actor_count: actorCount } = item;
  const activity = item.activities[0] as FeedActivity;
  const { actor, time, object } = activity;

  const actorName = actor.lastName ? `${actor.firstName} ${actor.lastName}` : actor.lastName;
  const action = verb === 'commented' ? 'commented on' : verb;

  return (
    <div className="rounded-sm p-5 border border-gray-300 my-4">
      <div>
        <div>
        <Link href={`/${actor.username}`}>
          <a className="font-bold">
            {actorName}
          </a>
        </Link>

        {
          actorCount > 1 && (
            <>
              &nbsp;and {actorCount - 1} other{actorCount > 2 ? 's' : ''}
            </>
          )
        }
        
        &nbsp;{action}&nbsp;

        {
          object?.__typename === 'Article' && (
            <>
              {`${item.activities.length === 1 ? 'an article' : item.activities.length + ' articles'}`}
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
          {formatPretty(time)}
        </div>
      </div>

      {
        object?.__typename === 'Article' && item.activities.map((activity: FeedActivity | null) => {        
          if (!activity) return;
          return (
            <div key={activity.id} className="mt-4">
              <ArticleCard article={activity.object as Article} />
            </div>
          );
        })
      }

      {
        object?.__typename === 'Comment' && item.activities.length === 1 &&  (
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

function Feed(): React.ReactElement {
  const { loading, error, data } = useQuery(FeedQuery);

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading</div>;

  const { feed } = data;
  
  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      {feed.results.map((feedItem: FeedItem) => <Item key={feedItem.id} item={feedItem} />)}
    </div>
  );
}

export default Feed;
