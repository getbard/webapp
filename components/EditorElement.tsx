import { RenderElementProps } from 'slate-react';
import ProgressiveImage from 'react-progressive-image';

const ImageElement = ({ attributes, children, element }: RenderElementProps): React.ReactElement => {
  return (
    <div {...attributes}>
      {children}
      
      <ProgressiveImage
        delay={500}
        src={`${element.url}`}
        placeholder={`${element.url}&q=50&blur=80`}
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
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>;
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>;
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>;
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
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
