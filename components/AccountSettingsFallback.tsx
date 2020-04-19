import { useState } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useForm } from 'react-hook-form';
import { FiLoader } from 'react-icons/fi';

import { useAuth } from '../hooks/useAuth';

import UserAccountSettingsQuery from '../queries/UserAccountSettingsQuery';
import UsernameQuery from '../queries/UsernameQuery';
import UpdateUserMutation from '../queries/UpdateUserMutation';

import Button from './Button';
import Notification from './Notification';
import GenericError from './GenericError';


const AccountSettingsFallback = (): React.ReactElement => {
  return (
    <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm">
        <div className="mb-4">
          <div className="h-8 bg-gray-200 rounded-sm w-full py-2 px-3"></div>
        </div>

        <div className="mb-4">
          <div className="h-8 bg-gray-200 rounded-sm w-full py-2 px-3"></div>
        </div>

        <div className="mb-4">
          <div className="h-8 bg-gray-200 rounded-sm w-full py-2 px-3"></div>
        </div>

        <div className="mb-4">
          <div className="h-8 bg-gray-200 rounded-sm w-full py-2 px-3"></div>
        </div>

        <div className="flex justify-end">
          <div className="bg-gray-200 h-10 w-20"></div>
        </div>
    </div>
  );
}

export default AccountSettingsFallback;
