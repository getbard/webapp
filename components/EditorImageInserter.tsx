import { useRef, useEffect, useState, useCallback } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Transforms, Editor } from 'slate'
import styled from '@emotion/styled';
import { FiImage } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@apollo/react-hooks';
import { FiLoader } from 'react-icons/fi';

import UploadImageMutation from '../queries/UploadImageMutation';

const MAX_FILE_SIZE = 5000000;

import Portal from './Portal';
import Modal from './Modal';

const Menu = styled.div`
  margin-top: -6px;
  transition-property: background-color, color;
  transition-duration: 500ms;
`;

const DropContainer = styled.div`
  width: 50vw;
`;

function EditorInsertImage(): React.ReactElement {
  const ref = useRef<HTMLDivElement>();
  const editor = useSlate();
  const [display, setDisplay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadImage, { loading, data, error: uploadError }] = useMutation(UploadImageMutation);

  if (uploadError) {
    setError('Something went wrong. Please give it another shot!');
  }

  useEffect(() => {
    // Handle upload image
    if (data?.uploadImage?.url) {
      const text = { text: '' };
      const image = { type: 'image', url: data?.uploadImage?.url, children: [text] };

      // Insert the image into the editor
      Transforms.insertNodes(editor, image);
      setDisplay(false);
      setError(null);

      // Focus the editor
      ReactEditor.focus(editor);
      Transforms.select(editor, Editor.end(editor, []));
    }
  }, [loading]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Called on accepted and rejected drops
    if (!acceptedFiles.length) {
      return;
    }

    if (acceptedFiles.length > 1) {
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
      : 'The file type you tried to upload is not allowed'
    setError(error);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: 'image/*',
    maxSize: MAX_FILE_SIZE,
  });

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
      el.removeAttribute('style');
      return;
    }

    const domRange = domSelection?.getRangeAt(0);
    const rect = domRange?.getBoundingClientRect();

    el.style.opacity = '1';
    el.style.top = `${(rect?.top || 0) + window.pageYOffset}px`;
    el.style.left = `${(editorBounds?.x || 0) - 20}px`;
  });

  return (
    <Portal selector="body">
      <Menu
        ref={ref as React.RefObject<any>}
        className="hover:cursor-pointer hover:bg-gray-200 text-gray-500 hover:text-gray-800 text-lg rounded-sm px-2 py-2 absolute z-10 opacity-0"
      >
        <FiImage onClick={(): void => {
          window.analytics.track('EDITOR IMAGE INSERTER: Inserter opened');
          setDisplay(true);
        }} />
      </Menu>

      <Modal open={display} onModalClose={(): void => setDisplay(false)}>
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
      </Modal>
    </Portal>
  );
}

export default EditorInsertImage;
