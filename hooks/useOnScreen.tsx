import { useEffect, RefObject, useState } from 'react';

// Sourced from usehooks.com <3
function useOnScreen(
  ref: RefObject<HTMLElement>,
  rootMargin = '0px',
): boolean {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return (): void => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting;
}

export default useOnScreen;
