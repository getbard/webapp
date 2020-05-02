import { useState, useRef } from 'react';
import { FiImage } from 'react-icons/fi';
import styled from '@emotion/styled';

import { ArticleHeaderImage } from '../generated/graphql';

import useOnClickOutside from '../hooks/useOnClickOutside';

import PhotoSelector from './PhotoSelector';
import ImageUploader from './ImageUploader';
import EditorHeaderPhotoSelectorTab from './EditorHeaderPhotoSelectorTab';

const PhotoSelectorContainer = styled.div`
  width: max-content;
`;


export function EditorHeaderPhotoSelector({
  headerImage,
  setHeaderImage,
}: {
  headerImage: ArticleHeaderImage | null;
  setHeaderImage: (headerImage: ArticleHeaderImage | null) => void;
}): React.ReactElement {
  const selectorRef = useRef(null);
  const [display, setDisplay] = useState(false);
  const [photoSelector, setPhotoSelector] = useState('unsplash');

  useOnClickOutside(selectorRef, () => {
    if (display) {
      setDisplay(!display);
    }
  });

  const handleSelect = (selectedImage: ArticleHeaderImage | string | null): void => {
    const headerImage = typeof selectedImage === 'string'
     ? { id: selectedImage, url: selectedImage } as ArticleHeaderImage
     : selectedImage;

    setHeaderImage(headerImage);
    setDisplay(false);
  }

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center hover:bg-gray-200 text-gray-500 hover:text-gray-800 w-auto max-w-screen px-2 py-1 -ml-2 rounded-sm transition duration-500 focus:outline-none"
        onClick={(): void => setDisplay(!display)}
      >
        <FiImage className="mr-1" /> {headerImage?.url ? 'Change' : 'Add'} Header Photo
      </button>
      {
        display
        && (
          <div ref={selectorRef}>
            <PhotoSelectorContainer className="absolute top-0 -ml-2 z-10 mt-8 bg-gray-100 p-2 rounded-sm border border-gray-300">
              <div className="mb-5 space-x-4">
                <EditorHeaderPhotoSelectorTab
                  name="Unsplash"
                  photoSelector={photoSelector}
                  setPhotoSelector={setPhotoSelector}
                />

                <EditorHeaderPhotoSelectorTab
                  name="Upload"
                  photoSelector={photoSelector}
                  setPhotoSelector={setPhotoSelector}
                />
              </div>

              {
                photoSelector === 'unsplash'
                  ? <PhotoSelector onSelect={handleSelect} />
                  : <ImageUploader onSelect={handleSelect} />
              }
            </PhotoSelectorContainer>
          </div>
        )
      }
    </div>
  );
}

export default EditorHeaderPhotoSelector;
