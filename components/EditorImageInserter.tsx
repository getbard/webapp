import { useRef, useEffect, useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Transforms, Editor } from 'slate'
import styled from '@emotion/styled';
import { FiImage } from 'react-icons/fi';

import Portal from './Portal';
import Modal from './Modal';
import ImageUploader from './ImageUploader';

const Menu = styled.div`
  margin-top: -6px;
  transition-property: background-color, color;
  transition-duration: 500ms;
`;

function EditorInsertImage(): React.ReactElement {
  const ref = useRef<HTMLDivElement>();
  const editor = useSlate();
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) {
      return
    }

    const editorBounds = document.querySelector('.editor-container')?.getBoundingClientRect();
    const domSelection = window.getSelection();
    
    // If there is no valid selection
    // (can happen when CTRL+Z after an image was uploaded)
    // or the editor is not focused
    // remove styling and return early
    if (((domSelection?.rangeCount || 0) <= 0) || !ReactEditor.isFocused(editor)) {
      console.log('HIDE ICON', display);
      el.style.opacity = '0';
      return;
    }

    const domRange = domSelection?.getRangeAt(0);
    const rect = domRange?.getBoundingClientRect();

    el.style.opacity = '1';
    el.style.top = `${(rect?.top || 0) + window.pageYOffset}px`;
    el.style.left = `${(editorBounds?.x || 0) - 20}px`;
  });

  const handleSelect = (url: string): void => {
    const text = { text: '' };
    const image = { type: 'image', url, children: [text] };

    // Insert the image into the editor
    Transforms.insertNodes(editor, image);
    setDisplay(false);

    // Focus the editor
    ReactEditor.focus(editor);
    Transforms.select(editor, Editor.end(editor, []));
  }

  return (
    <Portal selector="body">
      <Menu
        ref={ref as React.RefObject<any>}
        className="hidden sm:block hover:cursor-pointer hover:bg-gray-200 text-gray-500 hover:text-gray-800 text-lg rounded-sm px-2 py-2 absolute z-10 opacity-0"
        onClick={(): void => {
          setDisplay(true);
          window.analytics.track('EDITOR IMAGE INSERTER: Inserter opened');
          console.log('DEBUG EDITOR');
        }}
      >
        <FiImage />
      </Menu>

      <Modal open={display} onModalClose={(): void => setDisplay(false)}>
        <ImageUploader onSelect={handleSelect} />
      </Modal>
    </Portal>
  );
}

export default EditorInsertImage;
