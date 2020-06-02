import { useState, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
import styled from '@emotion/styled';
import { useMutation } from '@apollo/react-hooks';

import { User } from '../generated/graphql';
import UpdateUserMutation from '../queries/UpdateUserMutation';

import Modal from './Modal';
import ImageUploader from './ImageUploader';
import Notification from './Notification';


type AvatarContainerProps = {
  url: string;
}

const AvatarContainer = styled.div`
  background-size: cover;
  background-position: center;
  background-image: url(${(props: AvatarContainerProps): string => props.url});

  &:hover {
    .upload-indicator {
      display: flex;
    }
  }
`;

function Avatar({
  readOnly,
  user,
  small = false,
}: {
  user: User;
  readOnly: boolean;
  small?: boolean;
}): React.ReactElement {
  const [display, setDisplay] = useState(false);
  const [url, setUrl] = useState(user?.avatarUrl || encodeURI(`https://avatars.dicebear.com/api/identicon/${user.username}.svg?options[background]=%23004346&options[colors]=["blueGrey"]&options[colorLevel]=50`));

  const [updateUser, { loading, error, called }] = useMutation(UpdateUserMutation);

  const trackingData = {
    userId: user.id,
  };
  
  const handleSelect = (avatarUrl: string): void => {
    setDisplay(false);

    if (readOnly) {
      return;
    }

    updateUser({ variables: {
      input: {
        id: user.id,
        avatarUrl,
      },
    }});

    window.analytics.track('AVATAR: new avatar uploaded', {
      ...trackingData,
      oldUrl: url,
      newUrl: avatarUrl,
    });

    setUrl(avatarUrl);
  }

  return (
    <div>
      {
        !readOnly
          ? (
            <AvatarContainer
              className={`${small ? 'w-16 h-16' : 'w-40 h-40'} mx-auto rounded-sm relative`}
              url={url}
            >
              <div
                className="upload-indicator hidden w-full h-full bg-white absolute bg-opacity-75 hover:cursor-pointer justify-center items-center text-4xl text-primary"
                onClick={(): void => {
                  window.analytics.track('AVATAR: upload icon clicked', trackingData);
                  setDisplay(true);
                }}
              >
                <FiUpload />
              </div>

              <Modal open={display} onModalClose={(): void => setDisplay(false)}>
                <ImageUploader onSelect={handleSelect} />
              </Modal>

              <Notification
                showNotification={!loading && called}
                error={error}
                bgColor="bg-primary"
              >
                Saved
              </Notification>
            </AvatarContainer>
          )
          : <AvatarContainer className={`${small ? 'w-16 h-16' : 'w-40 h-40'} mx-auto rounded-sm`} url={url} />
      }
    </div>
  )
}

export default Avatar;
