import Link from 'next/link';

import { Article, User } from '../generated/graphql';

import { useAuth } from '../hooks/useAuth';

function FeedCommentItemInfo({
  actor,
  resource
}: {
  actor: User;
  resource: Article;
}): React.ReactElement {
  const auth = useAuth();
  const usersOwnArticle = auth.userId === resource.author.id;
  const actorCommentedOnOwnArticle = actor.username === resource.author.username;
  const trackingData = {
    actor: {
      id: actor.id,
    },
    resource,
    usersOwnArticle,
  };

  return (
    <>
      {
        actorCommentedOnOwnArticle && (
          <>
            their article&nbsp;
          </>
        )
      }

      <Link href={`/articles/s/${resource.slug}`}>
        <a
          className="font-bold"
          onClick={(): void => window.analytics.track('FEED COMMENT INFO: Resource title clicked', trackingData)}
        >
          {resource.title}
        </a>
      </Link>

      {
        !actorCommentedOnOwnArticle && !usersOwnArticle && (
          <>
            &nbsp;by&nbsp;

            <Link href={`/${resource.author.username}`}>
              <a
                className="font-bold"
                onClick={(): void => window.analytics.track('FEED COMMENT INFO: Resource author clicked', trackingData)}
              >
                {resource.author.firstName} {resource.author?.lastName}
              </a>
            </Link>
          </>
        )
      }
    </>
  );
}

export default FeedCommentItemInfo;
