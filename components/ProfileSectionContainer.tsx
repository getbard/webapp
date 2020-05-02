import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Node } from 'slate';
import { useRouter } from 'next/router';
import TextareaAutosize from 'react-textarea-autosize';

import Editor from './Editor';
import Button from './Button';
import EditorHeaderPhotoSelector from './EditorHeaderPhotoSelector';
import Notification from './Notification';

import { ProfileSection, CreateProfileSectionInput, UpdateProfileSectionInput } from '../generated/graphql';
import CreateProfileSectionMutation from '../queries/CreateProfileSectionMutation';
import UpdateProfileSectionMutation from '../queries/UpdateProfileSectionMutation';
import UsernameQuery from '../queries/UsernameQuery';

const emptyDocumentString = '[{"type":"paragraph","children":[{"text":""}]}]';

function ProfileSectionContainer({ section }: { section?: ProfileSection }): React.ReactElement {
  const router = useRouter();

  const [title, setTitle] = useState(section?.title || '');
  const [content, setContent] = useState(section?.content || emptyDocumentString);
  const [headerImage, setHeaderImage] = useState(section?.headerImage || null);

  const { data: userData } = useQuery(UsernameQuery, { variables: { username: 'me' } });

  const [createProfileSection, {
    called: createMutationCalled,
    loading: createMutationLoading,
    error: createMutationError,
  }] = useMutation(CreateProfileSectionMutation);

  const [updateProfileSection, {
    called: updateMutationCalled,
    loading: updateMutationLoading,
    error: updateMutationError,
  }] = useMutation(UpdateProfileSectionMutation);

  // Redirect to the user's profile after
  // successful creation/update
  useEffect(() => {
    const noMutationErrors = !createMutationError && !updateMutationError;
    const mutationWasCalled = createMutationCalled || updateMutationCalled;

    if (noMutationErrors && mutationWasCalled) {
      const username = userData?.user?.username || 'me';
      router.push(`/${username}?section=${title}`);
    }
  }, [createMutationLoading, updateMutationLoading]);

  const handleContentChange = (newContent: Node[]): void => {
    const contentString = JSON.stringify(newContent);
    setContent(contentString);
  }

  const handleSaveSection = (): void => {
    if (content === emptyDocumentString) {
      return;
    }

    const mutation = section?.id ? updateProfileSection : createProfileSection;

    if (headerImage?.__typename) {
      delete headerImage.__typename;
    }

    let input = {
      title,
      content,
      headerImage,
    } as CreateProfileSectionInput;

    if (section?.id) {
      input = {
        id: section.id,
        ...input,
      } as UpdateProfileSectionInput;
    }

    mutation({ variables: { input } });
  }

  return (
    <div className="relative py-5">
      <div className="sticky bg-white z-20 top-0 min-w-screen py-2 mb-4">
        <div className="flex justify-end sm:w-3/5 px-5 container mx-auto">
          <Button
            thin
            onClick={handleSaveSection}
            className="focus:outline-none"
            loading={createMutationLoading || updateMutationLoading}
            disabled={!title && content === emptyDocumentString}
          >
            {section?.id ? 'Save section' : 'Create section'}
            </Button>
        </div>
      </div>

      <div className="editor-container sm:w-3/5 px-5 container mx-auto">
        {
          headerImage?.url
          && <img src={headerImage?.url} className="max-h-screen mx-auto mb-4" />
        }

        <div className="w-full">
          <EditorHeaderPhotoSelector
            headerImage={headerImage}
            setHeaderImage={setHeaderImage}
          />
        </div>

        <TextareaAutosize
          className="focus:outline-none text-4xl font-serif w-full h-auto resize-none placeholder-gray-500 font-bold"
          placeholder="Section Title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setTitle(e.target.value)}
          maxLength={80}
        >
        </TextareaAutosize>

        <Editor
          initialValue={JSON.parse(content)}
          setContent={handleContentChange}
          placeholder="Create compelling profile content that engages your readers."
        />

        <Notification
          showNotification={false}
          error={createMutationError || updateMutationError}
          bgColor="bg-primary"
        />
      </div>
    </div>
  );
}

export default ProfileSectionContainer;
