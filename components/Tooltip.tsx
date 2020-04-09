import { useEffect, useState } from 'react';
import Portal from './Portal';
import styled from '@emotion/styled';


type TooltipContainerProps = {
  opacity: string;
  top: string;
}

const TooltipContainer = styled.div`
  top: ${(props: TooltipContainerProps): string => props.top}rem;
  opacity: ${(props: TooltipContainerProps): string => props.opacity};
`;

function Tooltip({
  children,
  showTooltip,
  selector,
  top = '-2.5',
  pos,
}: {
  children: React.ReactNode;
  showTooltip: boolean;
  selector: string;
  top?: string;
  pos?: string;
}): React.ReactElement {
  const [display, setDisplay] = useState(true);
  const [opacity, setOpacity] = useState('100');
  
  // Allow a nice fadeout
  useEffect(() => {
    if (showTooltip) {
      setDisplay(true);
      setTimeout(() => setOpacity('100'), 50);
    } else {
      setOpacity('0');
      setTimeout(() => setDisplay(false), 300);
    }
  }, [showTooltip]);

  const tooltipClasses = `${pos || 'left-0'} text-xs text-center bg-black text-white rounded-sm px-2 py-2 absolute z-10 whitespace-no-wrap transition duration-300 ease-in-out`;

  return (
    <Portal selector={selector}>
      {
        display && (
          <TooltipContainer
            className={tooltipClasses}
            opacity={opacity}
            top={top}
          >
            {children}
          </TooltipContainer>
        )
      }
    </Portal>
  );
}

export default Tooltip;
