import { useEffect, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@apollo/react-hooks';
import { FiLoader } from 'react-icons/fi';

import UploadImageMutation from '../queries/UploadImageMutation';

const MAX_FILE_SIZE = 5000000;

const DropContainer = styled.div`
  width: 50vw;
`;

function ImageUploader({
  onSelect,
}: {
  onSelect: (imageUrl: string) => void;
}): React.ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [uploadImage, { loading, data, error: uploadError }] = useMutation(UploadImageMutation);

  if (uploadError) {
    setError('Something went wrong. Please give it another shot!');
  }

  useEffect(() => {
    // Handle upload image
    if (data?.uploadImage?.url) {
      window.analytics.track('IMAGE UPLOADER: File uploaded', { url: data.uploadImage.url });
      setError(null);
      onSelect(data.uploadImage.url);
    }
  }, [loading]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Called on accepted and rejected drops
    if (!acceptedFiles.length) {
      return;
    }

    if (acceptedFiles.length > 1) {
      window.analytics.track('IMAGE UPLOADER: Multiple upload attempt');

      setError('Please select one image at a time');
      return;
    }

    const reader = new FileReader();
    reader.onload = (): void => {
      uploadImage({
        variables: {
          input: {
            name: acceptedFiles[0].name,
            type: acceptedFiles[0].type,
            content: reader.result,
          },
        },
      });
    }
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const onDropRejected = (rejectedFiles: File[]): void => {
    const error = rejectedFiles[0].size > MAX_FILE_SIZE
      ? 'The file you tried to upload is too large'
      : 'The file type you tried to upload is not allowed';

    window.analytics.track('IMAGE UPLOADER: File rejected', { error });

    setError(error);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: 'image/*',
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <DropContainer
      {...getRootProps()}
      className={`${isDragActive && 'border-primary'} hover:cursor-pointer p-20 border border-gray-300 border-dashed rounded-sm focus:outline-none text-center`}
    >
      <input {...getInputProps()} disabled={loading} />

      {
        loading
          ? <FiLoader className="inline-block icon-spin text-lg mr-1" />
          : <p>Drop an image or click to browse your images (5MB size limit)</p>
      }

      {
        error && (
          <p className="text-xs font-bold text-red-600 mt-2">
            {error}
          </p>
        )
      }
    </DropContainer>
  );
}

export default ImageUploader;
