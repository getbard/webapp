import { useState, useRef } from 'react';
import { FiFolder } from 'react-icons/fi';

import { Category } from '../generated/graphql';

import useOnClickOutside from '../hooks/useOnClickOutside';

export function EditorHeaderPhotoSelector({
  category,
  setCategory,
}: {
  category: Category | null;
  setCategory: (category: Category) => void;
}): React.ReactElement {
  const menuRef = useRef(null);
  const [display, setDisplay] = useState(false);

  const categories = [];
  for (const category in Category) {
    categories.push(category.toLowerCase());
  }

  useOnClickOutside(menuRef, () => {
    if (display) {
      setDisplay(!display);
    }
  });

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center hover:bg-gray-200 text-gray-500 hover:text-gray-800 w-auto px-2 py-1 ml-2 rounded-sm transition duration-500 focus:outline-none"
        onClick={(): void => setDisplay(!display)}
      >
        <FiFolder className="mr-1" />
        <span className="capitalize">{category || 'Select Category'}</span>
      </button>

      {
        display && (
          <div
            ref={menuRef}
            className="absolute top-0 mt-8 ml-2 left-0 right-0 bg-white border border-gray-300 shadow-sm z-10"
          >
            {
              categories.map(category => {
                return (
                  <div
                    key={category}
                    className="capitalize px-4 py-1 text-center hover:cursor-pointer hover:bg-gray-200 text-gray-500 hover:text-gray-800 font-medium"
                    onClick={(): void => {
                      setCategory(category as Category);
                      setDisplay(false);
                    }}
                  >
                    {category}
                  </div>
                );
              })
            }
          </div>
        )
      }
    </div>
  );
}

export default EditorHeaderPhotoSelector;
