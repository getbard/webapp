import { useState, useRef } from 'react';

import { Category } from '../generated/graphql';

import useOnClickOutside from '../hooks/useOnClickOutside';

const allCategories: string[] = [];
for (const category in Category) {
  allCategories.push(category.toLowerCase());
}

export function CategoryDropdown({
  category,
  categories,
  setCategory,
}: {
  category: string | null;
  categories?: string[];
  setCategory: (category: string) => void;
}): React.ReactElement {
  const menuRef = useRef(null);
  const [display, setDisplay] = useState(false);
  const [dropdownCategories] = useState(categories || allCategories);
  const isFeedSelected = category === 'feed';

  useOnClickOutside(menuRef, () => {
    if (display) {
      setDisplay(!display);
    }
  });

  return (
    <div className="relative inline-block">
      <button
        className={`${!isFeedSelected && 'text-primary'} flex items-center hover:bg-gray-200 hover:cursor-pointer hover:text-primary font-medium px-2 py-1 rounded-sm transition duration-500 focus:outline-none`}
        onClick={(): void => setDisplay(!display)}
      >
        <span className="capitalize">{isFeedSelected ? 'Select Category' : category}</span>
      </button>

      {
        display && (
          <div
            ref={menuRef}
            className="table absolute top-0 mt-8 left-0 right-0 bg-white border border-gray-300 shadow-sm z-10"
          >
            {
              dropdownCategories.map(category => {
                return (
                  <div
                    key={category}
                    className="capitalize px-4 py-2 text-center hover:cursor-pointer hover:bg-gray-200 hover:text-primary font-medium"
                    onClick={(): void => {
                      setCategory(category);
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

export default CategoryDropdown;
