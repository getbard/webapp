import { Editor, Transforms, Text } from 'slate';

export const isFormatActive = (editor: Editor, format: string): boolean => {
  const [match] = Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all',
  });
  return !!match;
}

export const toggleFormat = (editor: Editor, format: string): void => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true },
  );
}

export const toggleFormatInline = (editor: Editor, format: string): void => {
  const isActive = isFormatActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

export const timeToRead = (wordCount: number): string => {
  // The average adult reads 200 - 250 words per minute
  const t = ~~(wordCount / 200);
  // const minutes = t.toFixed(0);
  return `${Math.max(1, t)} min read`;
}