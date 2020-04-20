import isUrl from 'is-url';
import { Element, Transforms, Editor, Range } from 'slate';
import { ReactEditor } from 'slate-react';

export const isLinkActive = (editor: Editor): boolean => {
  const [link] = Editor.nodes(editor, {
    match: n => n.type === 'link',
  });

  return !!link;
};

export const unwrapLink = (editor: Editor): void => {
  Transforms.unwrapNodes(editor, { match: n => n.type === 'link' });
};

const wrapLink = (editor: Editor, url: string): void => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

export const insertLink = (editor: Editor, url: string): void => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

export const withLinks = (editor: ReactEditor): ReactEditor => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element: Element): boolean => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.insertText = (text: string): void => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data: DataTransfer): void => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

export default withLinks;
