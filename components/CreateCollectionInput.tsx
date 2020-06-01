import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import { useAuth } from '../hooks/useAuth';
import useOnClickOutside from '../hooks/useOnClickOutside';

import CreateCollectionMutation from '../queries/CreateCollectionMutation';

import Notification from './Notification';

type FormData = {
  name: string;
};

const Input = styled.input`
  min-width: 14rem;
`;

function CreateCollectionInput({ refetch }: { refetch: () => void }): React.ReactElement {
  const menuRef = useRef(null);
  const auth = useAuth();
  const { register, handleSubmit, errors } = useForm<FormData>();
  const [displayInput, setDisplayInput] = useState(false);
  const [createCollection, { error }] = useMutation(CreateCollectionMutation, {
    update() {
      refetch();
    }
  });

  useOnClickOutside(menuRef, () => {
    if (displayInput) {
      setDisplayInput(!displayInput);
    }
  });

  const onSubmit = ({ name }: FormData): void => {
    window.analytics.track('CREATE COLLECTION INPUT: Collection created from input', {
      name,
      userId: auth.userId,
    });

    createCollection({ variables: { input: { name } } });
    setDisplayInput(false);
  };

  return (
    <>
      <div className={`px-4 py-2 ${!displayInput ? 'bg-primary text-white hover:cursor-pointer hover:bg-secondary transition duration-150 ease-in-out' : ''}`}>
        {
          displayInput
            ? (
              <div className="-mx-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <label className="hidden" htmlFor="name">
                    Collection Title
                  </label>

                  <Input
                    className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.name && 'focus:border-primary'} placeholder-gray-500 ${errors.name && 'border-red-600'}`}
                    id="name"
                    placeholder="Collection name"
                    type="name"
                    name="name"
                    ref={register({
                      required: 'Please name your collection',
                    })}
                  />

                  <span className="text-red-600 text-xs font-bold">{errors.name && errors.name.message}</span>
                </form>
                <span className="text-xs">Press enter to create collection</span>
              </div>
            )
            : (
              <div
                className="flex justify-between items-center"
                onClick={(): void => setDisplayInput(!displayInput)}
              >
                Create a collection
              </div>
            )
        }
      </div>

      <Notification
        showNotification={false}
        error={error}
      />
    </>
  )
}

export default CreateCollectionInput;