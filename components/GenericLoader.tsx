import styled from '@emotion/styled';
import { FiFeather } from 'react-icons/fi';

const quotes = [{
  text: `Substitute 'damn' every time you're inclined to write 'very'; your editor will delete it and the writing will be just as it should be.`,
  author: 'Mark Twain',
}];

const Feather = styled(FiFeather)`
  @keyframes colorChange {
    0% {
      stroke: #004346;
    }
    50% {
      stroke: #81D2C7;
    }
    100% {
      stroke: #004346;
    }
  }

  stroke: red;
  animation: colorChange 2s infinite;
`;


function GenericLoader(): React.ReactElement {
  const quote = quotes[Math.floor(Math.random()) % quotes.length];

  return (
    <div className="flex justify-center items-center flex-col p-40 text-lg">
      <div className="px-40 mb-8 font-serif">
        <div className="text-2xl text-justify">
          &quot;{quote.text}&quot;
        </div>

        <div className="text-right">
          ~ {quote.author}
        </div>
      </div>

      <div className="text-4xl font-serif text-primary">
        <Feather />
      </div>
    </div>
  );
}

export default GenericLoader;
