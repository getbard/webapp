import { useState, useEffect } from 'react';
import { ApolloError } from 'apollo-client';

type Props = {
  saving: boolean;
  error: ApolloError | undefined;
  called: boolean;
}

const EditorLeaf = ({ saving, error, called }: Props): React.ReactElement => {
  const [display, setDisplay] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (!called) {
      return;
    }

    if (error) {
      setNotification('Darn, something went wrong. Try again!');
    } else if (saving) {
      setNotification('Saving...');
    } else {
      if (notification === 'Saving...') {
        setTimeout(() => setNotification('Saved!'), 500);
      } else {
        setNotification('Saved!');
      }
    }

    setDisplay(true);
    setTimeout(() => setDisplay(false), 2000);

    const notificationResetTimer = setTimeout(() => setNotification(''), 4000);

    return (): void => {
      clearInterval(notificationResetTimer);
    }
  }, [saving, error, called]);

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center">
      <p className={`${display ? 'opactiy-100' : 'opacity-0'} ${error ? 'bg-red-600' : 'bg-primary'} transition duration-300 transition-opacity px-4 py-2 mb-2 text-white rounded z-30`}>
        {notification}
      </p>
    </div>
  );
}

export default EditorLeaf;
