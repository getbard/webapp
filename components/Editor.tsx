import { useState, useMemo, useRef, useEffect } from 'react';
import { Slate, Editable, ReactEditor, withReact, useSlate } from 'slate-react';
import { Editor, Transforms, Text, createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';

import EditorLeaf from './EditorLeaf';

const emptyValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'Let the world know what is on your mind.' }],
  },
];

function BardEditor(): React.ReactElement {
  const [value, setValue] = useState<Node[]>(initialValue);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const clearEditor = (): void => {
    setValue(emptyValue);
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 }
    });
  };

  const handleOnChange = (newValue: Node[]): void => {
    if (newValue[0]?.children[0]?.text === initialValue[0].children[0].text) {
      clearEditor();
    } else {
      setValue(newValue);
    }
  };

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={handleOnChange}
    >
      <Editable
        renderLeaf={(props): JSX.Element => <EditorLeaf {...props} />}
      />
    </Slate>
  );
}

export default BardEditor;
