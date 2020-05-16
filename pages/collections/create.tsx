import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/react-hooks';
import TextareaAutosize from 'react-textarea-autosize';

import { useAuth } from '../../hooks/useAuth';

import CreateCollectionMutation from '../../queries/CreateCollectionMutation';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import Button from '../../components/Button';
import Notification from '../../components/Notification';
import PublicCollectionToggle from '../../components/PublicCollectionToggle';

const Collections: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const auth = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const [createCollection, { error, data }] = useMutation(CreateCollectionMutation);
  if (data?.createCollection?.id) {
    router.push(`/collections/${data.createCollection.id}`)
  }

  const trackingData = {
    name,
    description,
    public: isPublic,
    authorId: auth.userId,
  }

  const handleCreateCollection = (): void => {
    window.analytics.track('COLLECTION: Create clicked', trackingData);

    createCollection({
      variables: {
        input: {
          name,
          description,
          public: isPublic,
        }
      }
    });
  }

  const handlePublicToggle = (isPublic: boolean): void  => {
    setIsPublic(isPublic);
  }

  return (
    <>
      <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
        <div className="mb-6">
          <PublicCollectionToggle
            isPrivate={!isPublic}
            onClick={handlePublicToggle}
          />

          <div className="flex justify-between items-center">
            <TextareaAutosize 
              className="focus:outline-none text-4xl font-serif w-full h-auto resize-none placeholder-gray-500 font-bold"
              placeholder="Name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setName(e.target.value)}
              maxLength={80}
            >
            </TextareaAutosize>

            <Button onClick={handleCreateCollection} thin>
              Create
            </Button>
          </div>

          <TextareaAutosize 
            className="focus:outline-none text-xl w-full h-auto resize-none placeholder-gray-500 font-serif"
            placeholder="Add a description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setDescription(e.target.value)}
            maxLength={200}
          >
          </TextareaAutosize>
        </div>
      </div>

      <Notification
        showNotification={false}
        error={error}
      />
    </>
  );
}

export default withApollo()(withLayout(Collections));
