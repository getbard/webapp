import { useQuery } from '@apollo/react-hooks';

import { Collection } from '../generated/graphql';
import UserCollectionsQuery from '../queries/UserCollectionsQuery';

import CollectionRow from './CollectionRow';
import GenericError from './GenericError';
import CollectionRowFallback from './CollectionRowFallback'

function CollectionContainer({ username }: { username: string }): React.ReactElement {
  const { data, loading, error, refetch } = useQuery(UserCollectionsQuery, {
    variables: { username },
  });

  const collections = data?.user?.collections || [];

  if (loading) return (
    <div>
      {[1, 2, 3, 4].map((value: number) => (
        <CollectionRowFallback key={value} />
      ))}
    </div>
  );

  if (error) return <div><GenericError title error={error} /></div>;

  return (
    <div>
      {collections.map((collection: Collection) => (
        <CollectionRow
          key={collection.id}
          collection={collection}
          refetch={refetch}
        />
      ))}
    </div>
  );
}

export default CollectionContainer;
