import { useState, useMemo, useCallback } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';

import { toggleMarkInline, onKeyDownList } from '../lib/editor';

import withHtml from './withHtml';
import withImages from './withImages';
import { withLinks, insertLink } from './withLinks';
import { withList } from './withList';
import EditorLeaf from './EditorLeaf';
import EditorElement from './EditorElement';
import EditorToolbar from './EditorToolbar';
import EditorImageInserter from './EditorImageInserter';

const emptyValue = [{
  type: 'paragraph',
  children: [{ text: '' }],
}];

function BardEditor({
  setContent,
  readOnly,
  initialValue,
  placeholder,
}: {
  setContent?: (content: Node[]) => void;
  readOnly?: boolean;
  initialValue?: Node[];
  placeholder?: string;
}): React.ReactElement {
  const [value, setValue] = useState<Node[]>(initialValue || emptyValue);
  const editor = useMemo(() => withList(withLinks(withImages(withHtml(withHistory(withReact(createEditor())))))), []);
  const renderLeaf = useCallback((props): JSX.Element => <EditorLeaf {...props} />, []);
  const renderElement = useCallback((props): JSX.Element => <EditorElement {...props} />, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    onKeyDownList(e, editor);

    if (!e.ctrlKey && !e.metaKey) {
      return;
    }

    window.analytics.track('EDITOR: Meta key pressed', { key: e.key });
    
    switch(e.key) {
      case 'b': {
        e.preventDefault();
        toggleMarkInline(editor, 'bold');
        break;
      }
      case 'i': {
        e.preventDefault();
        toggleMarkInline(editor, 'italic');
        break;
      }
      case 'u': {
        e.preventDefault();
        toggleMarkInline(editor, 'underline');
        break;
      }
      case 'k': {
        e.preventDefault();
        const url = window.prompt('Enter the URL of the link:');
        if (!url) return;
        insertLink(editor, url);
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

      <EditorImageInserter />

      <Editable
        className="text-lg"
        readOnly={readOnly}
        placeholder={placeholder || 'Let the world know what is on your mind.'}
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        onKeyDown={handleKeyDown}
      />
    </Slate>
  );
}

export default BardEditor;
