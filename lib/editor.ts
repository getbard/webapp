import { Editor, Transforms, Text, Node, Ancestor, Path } from 'slate';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

export const isMarkActive = (editor: Editor, format: string): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

export const toggleMark = (editor: Editor, format: string): void => {
  const isActive = isMarkActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: n => Text.isText(n), split: true },
  );
}

export const toggleMarkInline = (editor: Editor, format: string): void => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

export const isBlockActive = (editor: Editor, format: string): boolean => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  });

  return !!match;
}

export const toggleBlock = (editor: Editor, format: string): void => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

export const isList = (n: Node): boolean =>{
  return LIST_TYPES.includes(n.type);
};

export const isListItem = (node: Node): boolean => node.type === 'list-item';

export const unwrapList = (editor: Editor): void => {
  Transforms.unwrapNodes(editor, {
    match: isListItem,
  });

  Transforms.unwrapNodes(editor, {
    match: isList,
    split: true,
  });
};

export const toggleList = (editor: Editor, listType: string): void => {
  const isActive = isBlockActive(editor, listType);

  unwrapList(editor);

  Transforms.setNodes(editor, {
    type: 'paragraph',
  });

  if (!isActive) {
    const list = { type: listType, children: [] };
    Transforms.wrapNodes(editor, list);

    const nodes = Editor.nodes(editor, {
      match: node => node.type === 'paragraph',
    });

    const listItem = { type: 'list-item', children: [] };
    for (const [, path] of nodes) {
      Transforms.wrapNodes(editor, listItem, { at: path });
    }
  }
};

export const isBlockTextEmpty = (node: Ancestor): boolean => {
  return node.children
    && node.children[node.children.length - 1]?.text?.length === 0;
};

export const isFirstChild = (path: Path): boolean => path[path.length - 1] === 0;

/**
 * Move a list item next to its parent.
 * The parent should be a list item.
 */
const moveUp = (
  editor: Editor,
  listNode: Ancestor,
  listPath: number[],
  listItemPath: number[],
): boolean | undefined => {
  const [listParentNode, listParentPath] = Editor.parent(editor, listPath);
  if (listParentNode.type !== 'list-item') return;

  const newListItemPath = Path.next(listParentPath);

  // Move item one level up
  Transforms.moveNodes(editor, {
    at: listItemPath,
    to: newListItemPath,
  });

  /**
   * Move the next siblings to a new list
   */
  const listItemIdx = listItemPath[listItemPath.length - 1];
  const siblingPath = [...listItemPath];
  const newListPath = newListItemPath.concat(1);
  let siblingFound = false;
  let newSiblingIdx = 0;
  listNode.children.forEach((n, idx) => {
    if (listItemIdx < idx) {
      if (!siblingFound) {
        siblingFound = true;

        Transforms.insertNodes(
          editor,
          {
            type: listNode.type,
            children: [],
          },
          { at: newListPath }
        );
      }

      siblingPath[siblingPath.length - 1] = listItemIdx;
      const newSiblingsPath = newListPath.concat(newSiblingIdx);
      newSiblingIdx++;
      Transforms.moveNodes(editor, {
        at: siblingPath,
        to: newSiblingsPath,
      });
    }
  });

  // Remove sublist if it was the first list item
  if (!listItemIdx) {
    Transforms.removeNodes(editor, {
      at: listPath,
    });
  }

  return true;
};

const moveDown = (
  editor: Editor,
  listNode: Ancestor,
  listItemPath: number[],
): void => {
  // Previous sibling is the new parent
  const previousSiblingItem = Editor.node(editor, Path.previous(listItemPath));

  if (previousSiblingItem) {
    const [previousNode, previousPath] = previousSiblingItem;

    const sublist = previousNode.children.find(isList);
    const newPath = previousPath.concat(
      sublist ? [1, sublist.children.length] : [1]
    );

    if (!sublist) {
      // Create new sublist
      Transforms.wrapNodes(
        editor,
        { type: listNode.type, children: [] },
        { at: listItemPath }
      );
    }

    // Move the current item to the sublist
    Transforms.moveNodes(editor, {
      at: listItemPath,
      to: newPath,
    });
  }
};

export const isSelectionInList = (editor: Editor): boolean => {
  return isBlockActive(editor, 'list-item');
}

export const onKeyDownList = (e: React.KeyboardEvent<HTMLDivElement>, editor: Editor): void => {
  const isStartOfDoc = editor?.selection?.anchor?.path[0] === 0 && editor?.selection?.anchor?.path[1] === 0;

  if (isStartOfDoc) {
    return;
  }

  if (['Tab', 'Enter', 'Backspace'].includes(e.key)) {
    if (editor.selection && isSelectionInList(editor)) {
      if (e.key === 'Tab') {
        e.preventDefault();
      }

      const [paragraphNode, paragraphPath] = Editor.parent(
        editor,
        editor.selection
      );
      if (paragraphNode.type !== 'paragraph') return;
      const [listItemNode, listItemPath] = Editor.parent(editor, paragraphPath);
      if (listItemNode.type !== 'list-tem') return;
      const [listNode, listPath] = Editor.parent(editor, listItemPath);

      if (
        (e.shiftKey && e.key === 'Tab') ||
        (['Enter', 'Backspace'].includes(e.key) &&
          isBlockTextEmpty(paragraphNode))
      ) {
        const moved = moveUp(editor, listNode, listPath, listItemPath);
        if (moved) e.preventDefault();
      }

      if (
        !e.shiftKey &&
        e.key === 'Tab' &&
        !isFirstChild(listItemPath)
      ) {
        moveDown(editor, listNode, listItemPath);
      }
    }
  }
};

// The average adult reads 200 - 250 words per minute
export const timeToReadNumber = (wordCount: number): number => ~~(wordCount / 200);

export const timeToRead = (wordCount: number): string => {
  return `${Math.max(1, timeToReadNumber(wordCount))} min read`;
}

export const serializeText = (nodes: Node[]): string => {
  return nodes.map(n => Node.string(n)).join('\n');
}
