import { withBreakEmptyReset } from './withBreakEmptyReset';
import { withDeleteStartReset } from './withDeleteStartReset';
import { Editor, Path, Point, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

export const withList = (editor: ReactEditor): ReactEditor => {
  const { insertBreak } = editor;

  editor.insertBreak = (): void => {
    if (editor.selection) {
      const [paragraphNode, paragraphPath] = Editor.parent(
        editor,
        editor.selection
      );
      if (paragraphNode.type === 'paragraph') {
        const [listItemNode, listItemPath] = Editor.parent(
          editor,
          paragraphPath
        );

        if (listItemNode.type === 'list-item') {
          if (!Range.isCollapsed(editor.selection)) {
            Transforms.delete(editor);
          }

          const start = Editor.start(editor, paragraphPath);
          const end = Editor.end(editor, paragraphPath);

          const isStart = Point.equals(editor.selection.anchor, start);
          const isEnd = Point.equals(editor.selection.anchor, end);

          const nextParagraphPath = Path.next(paragraphPath);
          const nextListItemPath = Path.next(listItemPath);

          /**
           * If start, insert a list item before
           */
          if (isStart) {
            Transforms.insertNodes(
              editor,
              {
                type: 'list-item',
                children: [{ type: 'paragraph', children: [{ text: '' }] }],
              },
              { at: listItemPath }
            );
            return;
          }

          /**
           * If not end, split nodes, wrap a list item on the new paragraph and move it to the next list item
           */
          if (!isEnd) {
            Transforms.splitNodes(editor, { at: editor.selection });
            Transforms.wrapNodes(
              editor,
              {
                type: 'list-item',
                children: [],
              },
              { at: nextParagraphPath }
            );
            Transforms.moveNodes(editor, {
              at: nextParagraphPath,
              to: nextListItemPath,
            });
          } else {
            /**
             * If end, insert a list item after and select it
             */
            Transforms.insertNodes(
              editor,
              {
                type: 'list-item',
                children: [{ type: 'paragraph', children: [{ text: '' }] }],
              },
              { at: nextListItemPath }
            );
            Transforms.select(editor, nextListItemPath);
          }

          /**
           * If there is a list in the list item, move it to the next list item
           */
          if (listItemNode.children.length > 1) {
            Transforms.moveNodes(editor, {
              at: nextParagraphPath,
              to: nextListItemPath.concat(1),
            });
          }

          return;
        }
      }
    }

    insertBreak();
  };

  const withBreakEmptyList = (): void => {
    Transforms.unwrapNodes(editor, {
      match: n => n.type === 'list-item',
      split: true,
    });
    Transforms.unwrapNodes(editor, {
      match: n => ['bulleted-list', 'numbered-list'].includes(n.type),
      split: true,
    });
  };

  let e = withBreakEmptyReset({
    types: ['list-item'],
    onUnwrap: withBreakEmptyList,
  })(editor);

  e = withDeleteStartReset({
    types: ['list-item'],
    onUnwrap: withBreakEmptyList,
  })(e);

  return e;
};
