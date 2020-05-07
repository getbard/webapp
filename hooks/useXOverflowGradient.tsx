import { useState, useEffect, RefObject } from 'react';

import useWindowSize from './useWindowSize';

function useXOverflowGradient(ref: RefObject<HTMLElement>): boolean[] {
  const [refOverflowing, setRefOverflowing] = useState(false);
  const [refScrollEnd, setRefScrollEnd] = useState(false);
  const size = useWindowSize();

  useEffect((): any => {
    if (!ref?.current) {
      return;
    }
    const isOverflowing = ref.current.scrollWidth > ref.current.clientWidth;

    if (refOverflowing !== isOverflowing) {
      setRefOverflowing(isOverflowing);
    }

    const handleScroll = (): void => {
      const offsetRight = ref?.current?.scrollWidth! - ref?.current?.clientWidth!;
      if (ref?.current?.scrollLeft! >= offsetRight && refScrollEnd === false) {
        setRefScrollEnd(true);
      } else {
        setRefScrollEnd(false);
      }
    }

    ref.current.addEventListener('scroll', handleScroll);

    return (): void => ref.current?.removeEventListener('scroll', handleScroll);
  }, [ref, size.width]); // Empty array ensures that effect is only run on mount and unmount

  return [refOverflowing, refScrollEnd];
}

export default useXOverflowGradient;
