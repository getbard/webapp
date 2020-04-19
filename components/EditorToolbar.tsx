import { useRef, useEffect } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Range, Editor } from 'slate';
import styled from '@emotion/styled';

import { isFormatActive, toggleFormat } from '../lib/editor';

import Portal from './Portal';

const Menu = styled.div`
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  transition: opacity 0.75s;
`;

const formatStyles: {
  [index: string]: string;
} = {
  bold: 'font-bold',
  italic: 'italic',
  underline: 'underline',
};

function FormatButton({ format }: { format: string}): React.ReactElement {
  const editor = useSlate();
  const formatStyle = formatStyles[format];

  return (
    <button
      className={`px-2 hover:text-secondary ${isFormatActive(editor, format) && 'text-secondary'}`}
      onMouseDown={(e): void => {
        e.preventDefault();
        window.analytics.track(`EDITOR TOOLBAR: ${format} clicked`);
        toggleFormat(editor, format);
      }}
    >
      <span className={`font-serif text-lg ${formatStyle}`}>
        {format[0].toUpperCase()}
      </span>
    </button>
  )
}

function HoveringToolbar(): React.ReactElement {
  const ref = useRef<HTMLDivElement>();
  const editor = useSlate();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection?.getRangeAt(0);
    const rect = domRange?.getBoundingClientRect();
    el.style.opacity = '1';
    el.style.top = `${(rect?.top || 0) + window.pageYOffset - el.offsetHeight}px`;
    const leftStyle = (rect?.left || 0) + window.pageXOffset - el.offsetWidth / 2 + (rect?.width || 0) / 2;
    // Don't let the menu go off the page
    el.style.left = `${Math.max(2, leftStyle)}px`;
  });

  return (
    <Portal selector="body">
      <Menu
        ref={ref as React.RefObject<any>}
        className="bg-black text-white rounded-sm px-2 py-2 absolute z-10 flex opacity-0"
      >
        <FormatButton format="bold" />
        <FormatButton format="italic" />
        <FormatButton format="underline" />
      </Menu>
    </Portal>
  );
}

export default HoveringToolbar;
