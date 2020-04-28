import { useQuery, useMutation } from '@apollo/react-hooks';
import Editor from './Editor';
import HeaderImage from './HeaderImage';
import { useRouter } from 'next/router';
import ProgressiveImage from 'react-progressive-image';

import { useAuth } from '../hooks/useAuth';

import { ProfileSection } from '../generated/graphql';
import ProfileSectionQuery from '../queries/ProfileSectionQuery';
import DeleteProfileSectionMutation from '../queries/DeleteProfileSectionMutation';

import Button from './Button';
import Notification from './Notification';
import BardError from '../pages/_error';
import GenericError from './GenericError';
import GenericLoader from './GenericLoader';

function ProfileSectionDisplay({
  section,
  onDelete,
}: {
  section: ProfileSection;
  onDelete: () => void;
}): React.ReactElement {
  const auth = useAuth();
  const router = useRouter();

  const { loading, data, error } = useQuery(ProfileSectionQuery, { variables: { id: section?.id } });

  const [deleteSection, {
    loading: deleteLoading,
    error: deleteError,
  }] = useMutation(DeleteProfileSectionMutation);
  
  if (loading) return <GenericLoader />;
  
  if (error?.message.includes('Section not found')) {
    return <BardError statusCode={404} hasGetInitialPropsRun={true} err={null} />;
  }
  if (error) return <div><GenericError title /></div>;

  const { profileSection } = data;

  const handleDeleteSection = (): void => {
    deleteSection({
      variables: {
        input: {
          id: profileSection.id,
        },
      },
    });

    if (onDelete) {
      onDelete();
    }
  }

  return (
    <div className="relative">
          {
            profileSection?.headerImage?.url && (
              <div className="mb-4">
                <ProgressiveImage
                  delay={500}
                  src={profileSection.headerImage.url}
                  placeholder={`${profileSection.headerImage.url}&w=400&blur=80`}
                >
                  {(src: string): React.ReactElement => <HeaderImage className="w-auto mb-1" url={src} />}
                </ProgressiveImage>

                <div className="text-xs text-center">
                  Photo by&nbsp;
                  <a
                    className="underline"
                    href={`${profileSection.headerImage.photographerUrl}?utm_source=bard&utm_medium=referral`}
                    onClick={(): void => window.analytics.track('PROFILE SECTION: Unsplash photographer URL clicked')}
                  >
                    {profileSection.headerImage.photographerName}
                  </a>
                  &nbsp;on&nbsp;
                  <a
                    className="underline"
                    href="https://unsplash.com?utm_source=bard&utm_medium=referral"
                    onClick={(): void => window.analytics.track('PROFILE SECTION: Unsplash URL clicked')}
                  >
                    Unsplash
                  </a>
                </div>
              </div>
            )
          }

      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-serif w-full h-auto font-bold">
          {profileSection?.title}
        </h2>
        
        <div>
          {
            auth.userId === profileSection?.userId && (
              <div className="flex">
                <Button
                  thin
                  onClick={(): Promise<boolean> => router.push(`/section/${section.id}`)}
                  className="focus:outline-none mr-2"
                >
                  Edit
                </Button>

                <Button
                  thin
                  onClick={handleDeleteSection}
                  className="focus:outline-none"
                  loading={deleteLoading}
                >
                  Delete
                </Button>
              </div>
            )
          }
        </div>
      </div>


      <Editor
        initialValue={JSON.parse(profileSection?.content)}
        readOnly
      />

      <Notification
        showNotification={false}
        error={deleteError}
      />
    </div>
  );
}

export default ProfileSectionDisplay;
