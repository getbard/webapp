import { Element, Transforms, Editor, Path, Node } from 'slate';
import { ReactEditor } from 'slate-react';

export const insertDivider = (editor: Editor): void => {
  const divider = {
    type: 'divider',
    children: [{ text: '' }],
  };

  Transforms.collapse(editor, { edge: 'end' });
  Transforms.insertNodes(editor, divider);
};

export const withDividers = (editor: ReactEditor): ReactEditor => {
  const { isVoid, normalizeNode } = editor;

  editor.normalizeNode = ([node, path]: [Node, Path]): void => {
    if (node.type === 'divider') {
      const newParagraph = {
        type: 'paragraph',
        children: [{ text: '' }],
      };

      Transforms.insertNodes(editor, newParagraph, { at: [path[0] + 1] });
      Transforms.select(editor, [path[0] + 1]);
    }

    return normalizeNode([node, path]);
  }

  editor.isVoid = (element: Element): boolean => {
    return element.type === 'divider' ? true : isVoid(element);
  }

  return editor;
};

export default withDividers;
