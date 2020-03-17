import { useState, useMemo } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';

import EditorLeaf from './EditorLeaf';
import EditorToolbar from './EditorToolbar';

const emptyValue = [
  {
    type: 'paragraph',
    children: [{ text: 'Okay world. This is what I am thinking. Boooo. Alice is a butthead.' }],
  },
];

function BardEditor(): React.ReactElement {
  const [value, setValue] = useState<Node[]>(emptyValue);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value): void => setValue(value)}
    >
      <EditorToolbar />
      <Editable
        placeholder="Let the world know what is on your mind."
        renderLeaf={(props): JSX.Element => <EditorLeaf {...props} />}
      />
    </Slate>
  );
}

export default BardEditor;
