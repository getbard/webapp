import { useState, useMemo } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';

import { toggleFormatInline } from '../lib/editor';

import withHtml from './withHtml';
import EditorLeaf from './EditorLeaf';
import EditorElement from './EditorElement';
import EditorToolbar from './EditorToolbar';

const emptyValue = [{
  type: 'paragraph',
  children: [{ text: '' }],
}];

function BardEditor({
  setContent,
  readOnly,
  initialValue,
  placeholder,
  small,
}: {
  setContent?: (content: Node[]) => void;
  readOnly?: boolean;
  initialValue?: Node[];
  placeholder?: string;
  small?: boolean;
}): React.ReactElement {
  const [value, setValue] = useState<Node[]>(initialValue || emptyValue);
  const editor = useMemo(() => withHtml(withHistory(withReact(createEditor()))), []);

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
    if (setContent) {
      setContent(value);
    }
  }

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={handleChange}
    >
      <EditorToolbar />

      <Editable
        className={`${!small && 'text-lg'}`}
        readOnly={readOnly}
        placeholder={placeholder || 'Let the world know what is on your mind.'}
        renderLeaf={(props): JSX.Element => <EditorLeaf {...props} />}
        renderElement={(props): JSX.Element => <EditorElement {...props} />}
        onKeyDown={handleKeyDown}
      />
    </Slate>
  );
}

export default BardEditor;
