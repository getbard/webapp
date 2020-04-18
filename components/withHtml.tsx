// Slate is amazing <3
// https://www.slatejs.org/examples/paste-html
import { Element, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { ReactEditor } from 'slate-react';

const ELEMENT_TAGS: {
  [key: string]: (el: Element) => { [key: string]: string };
} = {
  A: (el: Element): { [key: string]: string } => ({ type: 'link', url: el.getAttribute('href') }),
  BLOCKQUOTE: (): { [key: string]: string } => ({ type: 'quote' }),
  H1: (): { [key: string]: string } => ({ type: 'heading-one' }),
  H2: (): { [key: string]: string } => ({ type: 'heading-two' }),
  H3: (): { [key: string]: string } => ({ type: 'heading-three' }),
  H4: (): { [key: string]: string } => ({ type: 'heading-four' }),
  H5: (): { [key: string]: string } => ({ type: 'heading-five' }),
  H6: (): { [key: string]: string } => ({ type: 'heading-six' }),
  IMG: (el: Element): { [key: string]: string } => ({ type: 'image', url: el.getAttribute('src') }),
  LI: (): { [key: string]: string } => ({ type: 'list-item' }),
  OL: (): { [key: string]: string } => ({ type: 'numbered-list' }),
  P: (): { [key: string]: string } => ({ type: 'paragraph' }),
  PRE: (): { [key: string]: string } => ({ type: 'code' }),
  UL: (): { [key: string]: string } => ({ type: 'bulleted-list' }),
}

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS: {
  [key: string]: (el: Element) => { [key: string]: boolean };
}  = {
  CODE: (): { [key: string]: boolean } => ({ code: true }),
  DEL: (): { [key: string]: boolean } => ({ strikethrough: true }),
  EM: (): { [key: string]: boolean } => ({ italic: true }),
  I: (): { [key: string]: boolean } => ({ italic: true }),
  S: (): { [key: string]: boolean } => ({ strikethrough: true }),
  STRONG: (): { [key: string]: boolean } => ({ bold: true }),
  U: (): { [key: string]: boolean } => ({ underline: true }),
}

const deserialize = (el: any): any => {
  if (el.nodeType === 3) {
    // Remove line breaks from the start and end of the text
    const elContent = el.textContent.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, '');
    return elContent || null;
  } else if (el.nodeType !== 1) {
    return null;
  }

  const { nodeName } = el;
  let parent = el;

  if (nodeName === 'PRE' && el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
    parent = el.childNodes[0];
  }

  const children = Array.from(parent.childNodes)
    .map(deserialize)
    .flat();

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);
    return jsx('element', attrs, children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return children.map(child => jsx('text', attrs, child));
  }

  return children;
}

const withHtml = (editor: ReactEditor): ReactEditor => {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = (element: Element): boolean => {
    return element.type === 'link' ? true : isInline(element);
  }

  editor.isVoid = (element: Element): boolean => {
    return element.type === 'image' ? true : isVoid(element);
  }

  editor.insertData = (data: any): void => {
    const html = data.getData('text/html');

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const fragment = deserialize(parsed.body)
      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  }

  return editor;
}

export default withHtml;