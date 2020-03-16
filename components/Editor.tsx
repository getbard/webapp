import { useState, useMemo, useRef, useEffect } from 'react';
import { Slate, Editable, ReactEditor, withReact, useSlate } from 'slate-react';
import { Editor, Transforms, Text, createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';

function BardEditor(): React.ReactElement {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'Let the world know what is on your mind.' }],
    },
  ]);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value): void => setValue(value)}
    >
      <Editable />
    </Slate>
  );
}

export default BardEditor;
