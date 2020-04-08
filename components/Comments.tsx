import { useState, useRef, useMemo } from 'react';
import styled from '@emotion/styled';
import { Picker } from 'emoji-mart';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { BaseEmoji } from 'emoji-mart';
import { jsx } from 'slate-hyperscript';

import useOnClickOutside from '../hooks/useOnClickOutside';
import { toggleFormatInline } from '../lib/editor';

import EditorLeaf from './EditorLeaf';
import EditorElement from './EditorElement';
import EditorToolbar from './EditorToolbar';
import Editor from './Editor';
import Button from './Button';

const emptyValue = [{
  type: 'paragraph',
  children: [{ text: '' }],
}];

const EditorContainer = styled.div`
  min-height: 6rem;
`;

function Comments({ comments }: { comments: Comment[] } ): React.ReactElement {
  const emojiRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [value, setValue] = useState<Node[]>(emptyValue);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  useOnClickOutside(emojiRef, () => {
    if (showEmojiPicker) {
      setShowEmojiPicker(false);
    }
  });

  const handleEmojiSelection = (emoji: BaseEmoji): void => {
    Transforms.insertNodes(editor, [jsx('text', {}, emoji.native)]);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (!e.ctrlKey && !e.metaKey) {
      return;
    }
    
    switch(e.key) {
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

  return (
    <div className="mt-10">
      COMMENTS

      <div className="border border-gray-300 rounded-sm">
        <EditorContainer className="p-2 border-b border-gray-300">
          <Slate
            editor={editor}
            value={value}
            onChange={handleChange}
            native={true}
          >
            <EditorToolbar />

            <Editable
              placeholder="What did you think of the article?"
              renderLeaf={(props): JSX.Element => <EditorLeaf {...props} />}
              renderElement={(props): JSX.Element => <EditorElement {...props} />}
              onKeyDown={handleKeyDown}
            />
          </Slate>
        </EditorContainer>

        <div className="flex justify-between p-2 bg-gray-100">
          <div
            className="text-2xl hover:cursor-pointer relative"
            onClick={(): void => setShowEmojiPicker(!showEmojiPicker)}
            ref={emojiRef}
          >
            {showEmojiPicker && (
              <Picker
                style={{ position: 'absolute', bottom: '2.5rem' }}
                color="#004346"
                emoji="point_up"
                title=""
                onSelect={handleEmojiSelection}
              />
            )}
            <span className="px-1">
              {showEmojiPicker ? '😀' : '🙂'}
            </span>
          </div>

          <Button>
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Comments;
