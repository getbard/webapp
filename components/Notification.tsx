import { useState, useEffect } from 'react';
import Portal from './Portal';
import { ApolloError } from 'apollo-client';

function Notification({ children, showNotification, error, bgColor }: {
  children?: React.ReactNode;
  showNotification: boolean;
  error?: string | ApolloError | undefined;
  bgColor?: string;
}): React.ReactElement {
  const [display, setDisplay] = useState(false);
  const opacity = display ? '100' : '0';
  const notificationClasses = `opacity-${opacity} fixed bottom-0 left-0 right-0 flex justify-center z-30 text-white transition duration-300 ease-in-out pointer-events-none`;
  const notificationBackground = bgColor || 'bg-black';

  useEffect(() => {
    if (showNotification || error) {
      setDisplay(true);
    }

    const notificationResetTimer = setTimeout(() => setDisplay(false), 2000);

    return (): void => {
      clearInterval(notificationResetTimer);
    }

  }, [showNotification, error]);

  return (
    <Portal selector="body">
      <div className={notificationClasses}>
        <span className={`${error ? 'bg-red-600' : notificationBackground} rounded-sm px-4 py-2 mb-2`}>
          {error && 'Darn, something went wrong. Try again!'}
          {!error && children}
        </span>
      </div>
    </Portal>
  );
}

export default Notification;
