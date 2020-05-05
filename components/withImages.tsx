import { Node, Transforms, Path, Editor } from 'slate';
import { ReactEditor } from 'slate-react';

const withImages = (editor: ReactEditor): ReactEditor => {
  const { normalizeNode, insertBreak, deleteBackward } = editor;

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

  editor.deleteBackward = (unit: 'character' | 'word' | 'line' | 'block'): void => {
    const parent = Editor.above(editor, {
      match: n => ['image', 'caption'].includes(n.type),
    });
    
    if (parent) {
      const [, path] = parent;
      const nextPath = Path.next(path);

      try {
        const [nextNode] = Editor.node(editor, nextPath);
        if (nextNode?.type === 'caption') {
          Transforms.removeNodes(editor, { at: nextPath });
        }
      } catch (error) {
        // No node found
      }

      Transforms.setNodes(editor, { type: 'paragraph' });
    }

    deleteBackward(unit);
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