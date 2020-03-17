import { RenderLeafProps } from 'slate-react';

const EditorLeaf = ({ attributes, children, leaf }: RenderLeafProps): React.ReactElement => {
  // Handle placeholder
  if (leaf.text === 'Let the world know what is on your mind.') {
    children =  <span className="text-gray-400">{children}</span>
  }

  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underlined) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

export default EditorLeaf;
