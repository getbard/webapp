import { useRef, useEffect, useState, useCallback } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import styled from '@emotion/styled';
import { FiImage } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';

import Portal from './Portal';
import Modal from './Modal';

const Menu = styled.div`
  margin-top: -5.2px;
  transition-property: background-color, color;
  transition-duration: 500ms;
`;

function EditorInsertImage(): React.ReactElement {
  const ref = useRef<HTMLDivElement>();
  const editor = useSlate();
  const [display, setDisplay] = useState(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });

  useEffect(() => {
    const el = ref.current;

    if (!el) {
      return
    }

    if (!ReactEditor.isFocused(editor)) {
      el.removeAttribute('style');
      return;
    }

    const editorBounds = document.querySelector('.editor-container')?.getBoundingClientRect();
    const domSelection = window.getSelection();
    const domRange = domSelection?.getRangeAt(0);
    const rect = domRange?.getBoundingClientRect();

    el.style.opacity = '1';
    el.style.top = `${(rect?.top || 0) + window.pageYOffset}px`;
    el.style.left = `${(editorBounds?.x || 0) - 20}px`;
  });
console.log(display);
  return (
    <Portal selector="body">
      <Menu
        ref={ref as React.RefObject<any>}
        className="hover:cursor-pointer hover:bg-gray-200 text-gray-500 hover:text-gray-800 text-lg rounded-sm px-2 py-2 absolute z-10 opacity-0"
      >
        <FiImage onClick={(): void => setDisplay(true)} />
      </Menu>
      <Modal open={display} onModalClose={(): void => setDisplay(false)}>
        <div {...getRootProps()} className={`${isDragActive && 'border-primary'} hover:cursor-pointer p-20 border border-gray-300 border-dashed rounded-sm focus:outline-none`}>
          <input {...getInputProps()} />
          <p>Drop an image or click to browse your images</p>
        </div>
      </Modal>
    </Portal>
  )
}

export default EditorInsertImage;
