import { RenderElementProps, useEditor, useReadOnly } from 'slate-react';
import { Editor, Transforms, Node, Text } from 'slate';
import ProgressiveImage from 'react-progressive-image';
import styled from '@emotion/styled';

const CaptionElement = styled.div`
  span {
    width: 100%;
  }
`;

const ImageElement = ({ attributes, children, element }: RenderElementProps): React.ReactElement => {
  return (
    <div {...attributes}>
      {children}
      
      <ProgressiveImage
        delay={500}
        src={`${element.url}`}
        placeholder={`${element.url}&auto=compress&blur=80`}
      >
        {(src: string): React.ReactElement => 
          <img src={src} className="mx-auto" />
        }
      </ProgressiveImage>
    </div>
  );
};

const CaptionVoidElement = ({ attributes, children, element }: RenderElementProps): React.ReactElement => {
  const editor = useEditor();
  const readOnly = useReadOnly();
  const isDefaultText = Node.string(element) === 'Add a caption';

  const handleClick = (): void => {
    if (readOnly) {
      return;
    }

    if (editor.selection) {
      const parent = Editor.above(editor, {
        match: n => n.type === 'caption',
      });

      if (!parent) {
        return;
      }

      const [captionNode, captionPath] = parent;

      const isDefaultText = Node.string(captionNode) === 'Add a caption';
      if (isDefaultText) {
        Transforms.delete(editor, { at: captionPath });

        Transforms.insertNodes(editor, {
          type: 'caption',
          children: [{ text: '' }],
        }, { at: captionPath });

        Transforms.select(editor, captionPath);
      }
    }
  }

  return (
    <CaptionElement
      {...attributes}
      className="caption italic text-sm text-gray-600 mx-auto w-full text-center mt-1"
      onClick={handleClick}
    >
      {
        ((readOnly && !isDefaultText) || !readOnly) && (
          children
        )
      }
    </CaptionElement>
  );
}

const EditorElement = (props: RenderElementProps): React.ReactElement => {
  const { attributes, children, element } = props;

  switch (element.type) {
    default:
      return <p {...attributes} className="mt-4">{children}</p>;
    case 'quote':
      return (
        <blockquote {...attributes} className="p-8 mt-4 border-l-2 border-primary bg-gray-100 text-md">
          {children}
        </blockquote>
      );
    case 'code':
      return (
        <pre>
          <code {...attributes}>{children}</code>;
        </pre>
      );
    case 'heading-one':
      return <h1 {...attributes} className="text-5xl mt-10 font-serif">{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes} className="text-4xl mt-10 font-serif">{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes} className="text-3xl mt-10 font-serif">{children}</h3>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'bulleted-list':
        return <ul {...attributes} className="list-disc pl-6 mt-2">{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes} className="list-decimal pl-6 mt-2">{children}</ol>;
    case 'link':
      return (
        <a href={element.url} {...attributes} className="underline">
          {children}
        </a>
      );
    case 'image':
      return <ImageElement {...props} />;
    case 'caption':
      return <CaptionVoidElement {...props} />
  }
}

export default EditorElement;
