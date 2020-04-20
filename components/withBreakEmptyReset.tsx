import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { isBlockTextEmpty } from '../lib/editor';

export const withBreakEmptyReset = ({
  types,
  onUnwrap,
}: {
  types: string[];
  onUnwrap?: any;
}) => (editor: ReactEditor): ReactEditor => {
  const { insertBreak } = editor;

  editor.insertBreak = (): void => {
    const currentNodeEntry = Editor.above(editor, {
      match: n => Editor.isBlock(editor, n),
    });

    if (currentNodeEntry) {
      const [currentNode] = currentNodeEntry;

      if (isBlockTextEmpty(currentNode)) {
        const parent = Editor.above(editor, {
          match: n => types.includes(n.type),
        });

        if (parent) {
          Transforms.setNodes(editor, { type: 'paragraph' });

          if (onUnwrap) onUnwrap();

          return;
        }
      }
    }

    insertBreak();
  };

  return editor;
};