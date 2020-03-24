import { useState } from 'react';
import { FiImage } from 'react-icons/fi';

import PhotoSelector from './PhotoSelector';

export function EditorHeaderPhotoSelector({
  setHeaderImageURL,
}: {
  setHeaderImageURL: (url: string) => void;
}): React.ReactElement {
  const [display, setDisplay] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center hover:bg-gray-200 text-gray-500 hover:text-gray-800 w-auto px-2 py-1 -ml-2 rounded-sm transition duration-300 focus:outline-none"
        onClick={(): void => setDisplay(!display)}
      >
        <FiImage className="mr-1" /> Add Header Photo
      </button>
      {
        display
        && <PhotoSelector onSelect={setHeaderImageURL} display={display} setDisplay={setDisplay} />
      }
    </div>
  );
}

export default EditorHeaderPhotoSelector;
