import Link from 'next/link';

import { Collection } from '../generated/graphql';

function FeedUserInfo({
  collection,
}: {
  collection: Collection;
}): React.ReactElement {
  return (
    <Link href={`/collections/${collection.id}`}>
      <a
        className="font-bold"
        onClick={(): void => window.analytics.track('FEED COLLECTION INFO: Collection clicked', {
          collection: { id: collection.id },
        })}
      >
        {collection.name}
      </a>
    </Link>
  );
}

export default FeedUserInfo;
