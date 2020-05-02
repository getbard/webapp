import { RenderElementProps } from 'slate-react';
import ProgressiveImage from 'react-progressive-image';

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

const EditorElement = (props: RenderElementProps): React.ReactElement => {
  const { attributes, children, element } = props;

  switch (element.type) {
    default:
      return <p {...attributes}>{children}</p>;
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'code':
      return (
        <pre>
          <code {...attributes}>{children}</code>;
        </pre>
      );
    case 'heading-one':
      return <h1 {...attributes} className="text-5xl font-serif">{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes} className="text-4xl font-serif">{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes} className="text-3xl font-serif">{children}</h3>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'bulleted-list':
        return <ul {...attributes} className="list-disc pl-6">{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes} className="list-decimal pl-6">{children}</ol>;
    case 'link':
      return (
        <a href={element.url} {...attributes} className="underline">
          {children}
        </a>
      );
    case 'image':
      return <ImageElement {...props} />;
  }
}

export default EditorElement;
