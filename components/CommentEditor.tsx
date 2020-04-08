import { useState, useRef, useMemo, useEffect } from 'react';
import styled from '@emotion/styled';
import emojis from 'emoji-mart/data/apple.json';
import { NimblePicker } from 'emoji-mart';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { BaseEmoji } from 'emoji-mart';
import { jsx } from 'slate-hyperscript';
import { useMutation } from '@apollo/react-hooks';

import CreateCommentMutation from '../queries/CreateCommentMutation';

import useOnClickOutside from '../hooks/useOnClickOutside';
import { toggleFormatInline } from '../lib/editor';

import EditorLeaf from './EditorLeaf';
import EditorElement from './EditorElement';
import EditorToolbar from './EditorToolbar';
import Button from './Button';
import Notification from './Notification';

const emptyValue = [{
  type: 'paragraph',
  children: [{ text: '' }],
}];


type EditorContainerProps = {
  readOnly: boolean;
}

const EditorContainer = styled.div`
  [data-slate-editor="true"] {
    min-height: ${(props: EditorContainerProps): string => props.readOnly ? '1rem' : '5rem'};
  }
`;

function CommentEditor({
  resourceId,
  parentId,
  readOnly,
  initialValue,
  refetch,
  onSubmit,
}: {
  resourceId: string;
  parentId?: string;
  readOnly?: boolean;
  initialValue?: Node[];
  refetch?: () => void;
  onSubmit?: () => void;
}): React.ReactElement {
  const emojiRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [value, setValue] = useState<Node[]>(initialValue || emptyValue);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [createComment, { data, error, loading, called }] = useMutation(CreateCommentMutation);

  // Refetch after a load 
  useEffect(() => {
    if (called && !loading && refetch) {
      refetch();
    }
  }, [loading]);

  // Clear the comment if it was created successfully
  if (data?.createComment?.message === JSON.stringify(value)) {
    setValue(emptyValue);
  }

  useOnClickOutside(emojiRef, () => {
    if (showEmojiPicker) {
      setShowEmojiPicker(false);
    }
  });

  const handleEmojiSelection = (emoji: BaseEmoji): void => {
    Transforms.insertNodes(editor, [jsx('text', {}, emoji.native)]);
    setShowEmojiPicker(false);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (!e.ctrlKey && !e.metaKey) {
      return;
    }

    switch (e.key) {
      case 'b': {
        e.preventDefault();
        toggleFormatInline(editor, 'bold');
        break;
      }
      case 'i': {
        e.preventDefault();
        toggleFormatInline(editor, 'italic');
        break;
      }
      case 'u': {
        e.preventDefault();
        toggleFormatInline(editor, 'underline');
        break;
      }
    }
  }

  const handleChange = (value: Node[]): void => {
    setValue(value);
  }

  const handleCreateComment = (): void => {
    if (JSON.stringify(value) === JSON.stringify(emptyValue)) {
      return;
    }

    const message = JSON.stringify(value);

    createComment({
      variables: {
        input: {
          message,
          resourceId,
          parentId,
        },
      },
    });

    if (onSubmit) {
      onSubmit();
    }
  }

  return (
    <div>
      <div>
        <EditorContainer
          className={`p-4 ${!readOnly && 'shadow-inner'}`}
          readOnly={readOnly || false}
        >
          <Slate
            editor={editor}
            value={value}
            onChange={handleChange}
            native={true}
          >
            <EditorToolbar />

            <Editable
              readOnly={readOnly}
              placeholder="What did you think of the article?"
              renderLeaf={(props): JSX.Element => <EditorLeaf {...props} />}
              renderElement={(props): JSX.Element => <EditorElement {...props} />}
              onKeyDown={handleKeyDown}
            />
          </Slate>
        </EditorContainer>

        {
          !readOnly && (
            <div className="flex justify-between p-2 bg-gray-100 border-t border-gray-300">
              <div
                ref={emojiRef}
                className="text-2xl hover:cursor-pointer relative"
              >
                {showEmojiPicker && (
                  <NimblePicker
                    set="apple"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    data={emojis}
                    style={{ position: 'absolute', bottom: '2.5rem' }}
                    color="#004346"
                    emoji="point_up"
                    title=""
                    onSelect={handleEmojiSelection}
                  />
                )}
                <span
                  className="px-1"
                  onMouseDown={(e): void => {
                    e.preventDefault();
                    setShowEmojiPicker(!showEmojiPicker);
                  }}
                >
                  {showEmojiPicker ? '😀' : '🙂'}
                </span>
              </div>
    
              <Button
                onClick={handleCreateComment}
                loading={loading}
                disabled={JSON.stringify(value) === JSON.stringify(emptyValue)}
              >
                Comment
              </Button>
            </div>
          )
        }

        <Notification
          showNotification={false}
          error={error}
          bgColor="bg-primary"
        />
      </div>
    </div>
  );
}

export default CommentEditor;
