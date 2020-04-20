import { useState } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useForm } from 'react-hook-form';

import { useAuth } from '../hooks/useAuth';

import UserAccountSettingsQuery from '../queries/UserAccountSettingsQuery';
import UsernameQuery from '../queries/UsernameQuery';
import UpdateUserMutation from '../queries/UpdateUserMutation';

import Button from './Button';
import Notification from './Notification';
import AccountSettingsFallback from './AccountSettingsFallback';

type FormData = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
};

const AccountSettings = (): React.ReactElement => {
  const auth = useAuth();
  const [notification, setNotification] = useState('');
  const [displayEmailChangeWarning, setDisplayEmailChangeWarning] = useState(false);
  const { register, handleSubmit, triggerValidation, errors, setError } = useForm<FormData>();
  const { loading, data, error } = useQuery(UserAccountSettingsQuery, { variables: { username: 'me' } });

  const [checkUsername, {
    loading: usernameLoading,
    data: usernameData,
    called: usernameCalled,
  }] = useLazyQuery(UsernameQuery);

  const [updateUser, {
    loading: updateUserLoading,
    error: updateUserError,
    called: updateUserCalled,
  }] = useMutation(UpdateUserMutation);

  if (updateUserLoading && notification !== 'Saving...') {
    setNotification('Saving...');
  } else if (!updateUserLoading && notification === 'Saving...') {
    setTimeout(() => setNotification('Saved!'), 500);
  }

  if (loading) return <AccountSettingsFallback />;

  if (error) return (
    <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm">
      <h2 className="mb-2 font-bold">
        We weren&apos;t able to get your account settings.
      </h2>

      <p>
        Rest assured, we&apos;re on it! Check back in a little bit.
      </p>
    </div>
  );

  const onSubmit = ({ email, username, firstName, lastName }: FormData): void => {
    updateUser({ variables: {
      input: {
        id: data.user.id || auth.userId,
        email,
        username,
        firstName,
        lastName,
      },
    }});

    if (email !== data.user.email) {
      auth.signOut();
    }
  };

  if (!usernameLoading && usernameData && usernameCalled) {
    triggerValidation('username');
  }

  const checkUsernameAvailable = (): boolean => {
    if (usernameData?.username !== data.username) {
      setError('username', 'username', 'Sorry, that username has been taken');
      return false;
    }

    return true;
  }

  const { user } = data;

  return (
    <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="font-bold text-primary" htmlFor="firstName">
            First Name
          </label>

          <input
            className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.firstName && 'focus:border-primary'} placeholder-gray-500 ${errors.firstName && 'border-red-600'}`}
            id="firstName"
            defaultValue={user.firstName}
            type="firstName"
            name="firstName"
            ref={register({
              required: 'Please enter a first name',
            })}
          />
          <span className="text-xs font-bold text-red-600">{errors.firstName && errors.firstName?.message}</span>
        </div>

        <div className="mb-4">
          <label className="font-bold text-primary" htmlFor="lastName">
            Last Name
          </label>

          <input
            className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.lastName && 'focus:border-primary'} placeholder-gray-500 ${errors.lastName && 'border-red-600'}`}
            id="lastName"
            defaultValue={user.lastName}
            type="lastName"
            name="lastName"
            ref={register}
          />
          <span className="text-xs font-bold text-red-600">{errors.lastName && errors.lastName?.message}</span>
        </div>

        <div className="mb-4">
          <label className="font-bold text-primary" htmlFor="username">
            Username
          </label>

          <input
            className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.username && 'focus:border-primary'} placeholder-gray-500 ${errors.username && 'border-red-600'}`}
            id="username"
            defaultValue={user.username}
            type="username"
            name="username"
            onChange={(e): void => checkUsername({ variables: { username: e.target.value } })}
            ref={register({
              required: 'Please enter a username',
              validate: checkUsernameAvailable,
            })}
          />
          <span className="text-xs font-bold text-red-600">{errors.username && errors.username?.message}</span>
        </div>

        <div className="mb-4">
          <label className="font-bold text-primary" htmlFor="email">
            Email
          </label>

          <input
            className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.email && 'focus:border-primary'} placeholder-gray-500 ${errors.email && 'border-red-600'}`}
            id="email"
            defaultValue={user.email}
            type="email"
            name="email"
            onChange={(): void => setDisplayEmailChangeWarning(true)}
            ref={register({
              required: 'Please enter your email',
              pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: `The email you entered doesn't seem to be valid`,
              },
            })}
          />
          <span className="text-xs font-bold text-red-600">{errors.email && errors.email?.message}</span>
          <span className="text-xs font-bold text-primary">{displayEmailChangeWarning && 'Changing your email will require you to verify your new email and login again'}</span>
        </div>

        <Button
          className="w-full md:w-auto"
          loading={loading || updateUserLoading}
          disabled={loading || updateUserLoading || usernameLoading}
        >
          Save
        </Button>
      </form>


      <Notification
        showNotification={!updateUserLoading && updateUserCalled}
        error={error || updateUserError}
        bgColor="bg-primary"
      >
        {notification}
      </Notification>
    </div>
  );
}

export default AccountSettings;
