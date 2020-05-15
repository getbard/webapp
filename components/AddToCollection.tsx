import { useState, useRef } from 'react';
import { FaBookmark } from 'react-icons/fa';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FiCheck, FiX, FiPlus } from 'react-icons/fi';
import styled from '@emotion/styled';

import { Collection } from '../generated/graphql';

import useOnClickOutside from '../hooks/useOnClickOutside';

import UserCollectionsQuery from '../queries/UserCollectionsQuery';
import UpdateCollectionMutation from '../queries/UpdateCollectionMutation';

import CreateCollectionInput from './CreateCollectionInput';
import Notification from './Notification';

const CollectionRowContainer = styled.div`
  &:hover {
    .included-icon {
      display: none;
    }

    .action-icon {
      display: block;
      opacity: 1;
    }
  }
`;

function CollectionRow({
  articleId,
  collection,
  included = false,
}: {
  articleId: string;
  collection: Collection;
  included?: boolean;
}): React.ReactElement {
  const articleIds = collection?.articleIds || [];
  const updatedArticleIds = included
    ? [...articleIds.filter(currArticleId => currArticleId !== articleId)]
    : [...articleIds, articleId];

  const [updateCollection, { error }] = useMutation(UpdateCollectionMutation, {
    update(cache) {
      const data = cache.readQuery({
        query: UserCollectionsQuery,
        variables: { username: 'me' },
      }) as { user: any };

      const collections = data?.user?.collections || [];
      const updatedCollections = collections.map((currCollection: Collection) => {
        if (currCollection.id === collection.id) {
          return { ...currCollection, articleIds: updatedArticleIds };
        }

        return currCollection;
      });

      cache.writeQuery({
        query: UserCollectionsQuery,
        variables: { username: 'me' },
        data: {
          user: {
            ...data?.user || {},
            collections: updatedCollections,
          },
        },
      });
    }
  });

  const handleUpdateCollection = (): void => {
    const input = {
      ...collection,
      articleIds: updatedArticleIds,
    }

    if (input.__typename) {
      delete input.__typename;
    }

    if (input.userId) {
      delete input.userId;
    }

    updateCollection({
      variables: { input },
    });
  };

  return (
    <>
      <CollectionRowContainer
        onClick={handleUpdateCollection}
        className="px-4 py-2 font-medium hover:cursor-pointer hover:bg-gray-200 hover:text-primary flex justify-between items-center"
      >
        <div className="mr-4">
          {collection.name}
        </div>

        <div>
          <FiCheck className={`included-icon ${included ? 'block' : 'hidden'}`} />
          <span className={`action-icon ${included ? 'hidden' : 'block opacity-0'}`}>
            {
              included
                ? <FiX />
                : <FiPlus />
            }
          </span>
        </div>
      </CollectionRowContainer>

      <Notification
        showNotification={false}
        error={error}
      />
    </>
  );
}

function AddToCollection({ articleId }: { articleId: string }): React.ReactElement {
  const menuRef = useRef(null);
  const [display, setDisplay] = useState(false);
  const { data, refetch } = useQuery(UserCollectionsQuery, { variables: { username: 'me' } });

  useOnClickOutside(menuRef, () => {
    if (display) {
      setDisplay(!display);
    }
  });

  return (
    <div className="relative">
      <FaBookmark
        onClick={(): void => setDisplay(!display)}
        title="Add to collection"
        className="text-lg text-primary hover:text-secondary hover:cursor-pointer"
      />

      {
        display && (
          <div
            ref={menuRef}
            className="whitespace-no-wrap absolute top-0 mt-8 right-0 bg-white border border-gray-300 shadow-sm z-10"
          >
            {
              data?.user?.collections.map((collection: Collection) => (
                <CollectionRow
                  key={collection.id}
                  articleId={articleId}
                  collection={collection}
                  included={collection.articleIds?.includes(articleId)}
                />
              ))
            }

            <CreateCollectionInput refetch={refetch} />
          </div>
        )
      }
    </div>
  );
}

export default AddToCollection;
