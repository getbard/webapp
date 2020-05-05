import { Node, Transforms, Path, Editor } from 'slate';
import { ReactEditor } from 'slate-react';

const withImages = (editor: ReactEditor): ReactEditor => {
  const { normalizeNode, insertBreak } = editor;

  editor.normalizeNode = ([node, path]: [Node, Path]): void => {
    if (node.type === 'image') {
      const caption = {
        type: 'caption',
        children: [{ text: 'Add a caption' }],
      };

      Transforms.insertNodes(editor, caption, { at: [path[0] + 1] });
    }

    return normalizeNode([node, path]);
  }

  editor.insertBreak = (): void => {
    if (editor.selection) {
      const [captionNode] = Editor.parent(
        editor,
        editor.selection
      );

      if (captionNode.type === 'caption') {
        Transforms.insertNodes(editor, {
          type: 'paragraph',
          children: [{ text: '' }],
        });

        return;
      }
    }

    insertBreak();
  };

  return editor;
}

export default withImages;