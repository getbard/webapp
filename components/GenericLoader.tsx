import styled from '@emotion/styled';
import { FiFeather } from 'react-icons/fi';

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
  return (
    <div className="flex justify-center items-center h-screen -mt-20 text-6xl">
      <Feather />
    </div>
  );
}

export default GenericLoader;
