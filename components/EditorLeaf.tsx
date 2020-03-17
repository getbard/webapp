import { RenderLeafProps } from 'slate-react';

const EditorLeaf = ({ attributes, children, leaf }: RenderLeafProps): React.ReactElement => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

export default EditorLeaf;
