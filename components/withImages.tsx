import { Node, Transforms, Path } from 'slate';
import { ReactEditor } from 'slate-react';

const withImages = (editor: ReactEditor): ReactEditor => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]: [Node, Path]): void => {
    if (node.type === 'image') {
      const paragraph = {
        type: 'paragraph',
        children: [{ text: '' }],
      };

      Transforms.insertNodes(editor, paragraph, { at: [path[0] + 1] });
    }

    return normalizeNode([node, path]);
  }

  return editor;
}

export default withImages;