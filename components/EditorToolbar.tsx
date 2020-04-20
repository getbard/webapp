import { useRef, useEffect } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Range, Editor } from 'slate';
import styled from '@emotion/styled';
import { IconType } from 'react-icons';
import { FiLink } from 'react-icons/fi';
import { MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md';

import { isMarkActive, toggleMark, isBlockActive, toggleBlock, toggleList } from '../lib/editor';
import { insertLink } from './withLinks';

import Portal from './Portal';

const Menu = styled.div`
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  transition: opacity 0.75s;
`;

const formatStyles: {
  [key: string]: string;
} = {
  bold: 'font-bold',
  italic: 'italic',
  underline: 'underline',
};

const blockTypes: {
  [key: string]: { [key: string]:  string | IconType };
} = {
  'heading-one': {
    display: 'H1',
  },
  'heading-two': {
    display: 'H2',
  },
  'heading-three': {
    display: 'H3',
  },
  'numbered-list': {
    icon: MdFormatListNumbered,
  },
  'bulleted-list': {
    icon: MdFormatListBulleted,
  }
}

function LinkButton(): React.ReactElement {
  const editor = useSlate();

  return (
    <button
      className="px-2 hover:text-secondary"
      onMouseDown={(e): void => {
        e.preventDefault();

        window.analytics.track(`EDITOR TOOLBAR: Link clicked`);

        const url = window.prompt('Enter the URL of the link:');
        if (!url) return;
        insertLink(editor, url);
      }}
    >
      <span className="font-serif text-lg">
        <FiLink />
      </span>
    </button>
  )
}

function MarkButton({ format }: { format: string}): React.ReactElement {
  const editor = useSlate();
  const formatStyle = formatStyles[format];

  return (
    <button
      className={`px-2 hover:text-secondary ${isMarkActive(editor, format) && 'text-secondary'}`}
      onMouseDown={(e): void => {
        e.preventDefault();

        window.analytics.track(`EDITOR TOOLBAR: ${format} clicked`);

        toggleMark(editor, format);
      }}
    >
      <span className={`font-serif text-lg ${formatStyle}`}>
        {format[0].toUpperCase()}
      </span>
    </button>
  );
}

function BlockButton({ format }: { format: string }): React.ReactElement {
  const editor = useSlate();
  const block = blockTypes[format];
  const Icon = block?.icon;

  return (
    <button
      className={`px-2 hover:text-secondary ${isBlockActive(editor, format) && 'text-secondary'}`}
      onMouseDown={(e): void => {
        e.preventDefault();

        window.analytics.track(`EDITOR TOOLBAR: ${format} clicked`);

        toggleBlock(editor, format);
      }}
    >
      <span className="font-serif text-lg">
        {
          Icon
           ? (
            <Icon />
           )
           : block.display
        }
      </span>
    </button>
  )
}

function ListButton({ format }: { format: string }): React.ReactElement {
  const editor = useSlate();
  const Icon = blockTypes[format].icon;

  return (
    <button
      className={`px-2 hover:text-secondary ${isBlockActive(editor, format) && 'text-secondary'}`}
      onMouseDown={(e): void => {
        e.preventDefault();

        window.analytics.track(`EDITOR TOOLBAR: ${format} clicked`);

        toggleList(editor, format);
      }}
    >
      <span className="font-serif text-lg">
        <Icon />
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
        <div className="flex mr-4">
          <BlockButton format="heading-one" />
          <BlockButton format="heading-two" />
          <BlockButton format="heading-three" />
        </div>

        <div className="flex mr-4">
          <MarkButton format="bold" />
          <MarkButton format="italic" />
          <MarkButton format="underline" />
        </div>

        <div className="flex mr-4">
          <ListButton format="bulleted-list" />
          <ListButton format="numbered-list" />
        </div>

        <div className="flex">
          <LinkButton />
        </div>
      </Menu>
    </Portal>
  );
}

export default HoveringToolbar;
