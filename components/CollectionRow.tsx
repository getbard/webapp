
import Link from 'next/link';
import { useMutation } from '@apollo/react-hooks';
import { GoLock } from 'react-icons/go';

import { useAuth } from '../hooks/useAuth';

import { Collection } from '../generated/graphql';
import DeleteCollectionMutation from '../queries/DeleteCollectionMutation';

import Notification from './Notification';

function CollectionRow({ collection, refetch }: { collection: Collection; refetch: () => void }): React.ReactElement {
  const auth = useAuth();
  const collectionOwner = auth.userId === collection.userId;

  const [deleteCollection, { error }] = useMutation(DeleteCollectionMutation, {
    update() {
      refetch();
    }
  });

  const trackingData = {
    articleId: collection.id,
    name: collection.name,
    public: collection.public,
    authorId: collection.userId,
  }

  const handleDelete = (): void => {
    window.analytics.track('COLLECTION ROW: Delete clicked', trackingData);
    const deleteConfirmed = confirm('Are you sure you want to delete this collection? This will not delete the articles it contains.');

    if (deleteConfirmed) {
      window.analytics.track('COLLECTION ROW: Delete confirm clicked', trackingData);
      deleteCollection({ variables: { input: { id: collection.id } } });
    }
  }

  return (
    <div className="border border-gray-300 rounded-sm shadow-sm my-2 p-4 flex justify-between items-center">
      <div>
        <div>
          <Link href={`/collections/${collection.id}`}>
            <a
              className="flex items-center text-3xl font-serif hover:text-primary hover:cursor-pointer transition duration-150 ease-in-out"
              onClick={(): void => window.analytics.track('COLLECTION ROW: Collection name clicked', trackingData)}
            >
              {collection.name}

              {
                !collection.public && (
                  <span className="text-2xl text-primary px-2">
                    <GoLock title="Private" />
                  </span>
                )
              }
            </a>
          </Link>
        </div>

        <div>
          {
            collection?.description && (
              <div className="text-lg w-full mb-4">
                {collection?.description}
              </div>
            )
          }

          <div className="text-xs">
            {collection?.articleIds?.length || 0} article{collection?.articleIds?.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {collectionOwner && (
        <div className="flex justify-end items-center">
          <Link href={`/collections/${collection.id}`}>
            <a
              className="inline text-primary hover:underline hover:cursor-pointer mr-4 transition duration-150 ease-in-out"
              onClick={(): void => window.analytics.track('COLLECTION ROW: Edit clicked', trackingData)}
            >
              Edit
            </a>
          </Link>

          <div
            className="inline text-primary hover:underline hover:cursor-pointer transition duration-150 ease-in-out"
            onClick={handleDelete}
          >
            Delete
          </div>

          <Notification showNotification={!!error} error={error} />
        </div>
      )}
      </div>
  );
}

export default CollectionRow;
