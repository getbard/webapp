import { useState, useRef } from 'react';
import { FiImage } from 'react-icons/fi';

import { ArticleHeaderImage } from '../generated/graphql';

import useOnClickOutside from '../hooks/useOnClickOutside';

import PhotoSelector from './PhotoSelector';

export function EditorHeaderPhotoSelector({
  headerImage,
  setHeaderImage,
}: {
  headerImage: ArticleHeaderImage | null;
  setHeaderImage: (headerImage: ArticleHeaderImage | null) => void;
}): React.ReactElement {
  const selectorRef = useRef(null);
  const [display, setDisplay] = useState(false);

  useOnClickOutside(selectorRef, () => {
    if (display) {
      setDisplay(!display);
    }
  });

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
            <PhotoSelector onSelect={setHeaderImage} setDisplay={setDisplay} />
          </div>
        )
      }
    </div>
  );
}

export default EditorHeaderPhotoSelector;
