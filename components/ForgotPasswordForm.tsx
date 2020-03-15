import { useState } from 'react';
import firebase from '../lib/firebase';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';

import Button from './Button';

type FormData = {
  email: string;
  reset: string;
};

const ForgotPasswordForm = ({
  setForm
}: {
  setForm: React.Dispatch<React.SetStateAction<string>>;
}): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { register, handleSubmit, errors, setError } = useForm<FormData>();
  const setFormToLogin = (): void => setForm('login');

  const onSubmit = ({ email }: FormData): void => {
    setLoading(true);

    firebase
      .auth()
      .sendPasswordResetEmail(email).then(() => {
        // Email sent.
      }).catch(({ code }) => {
        setLoading(false);

        // Don't let people know if an account doesn't exist
        if (code === 'auth/user-not-found') {
          setResetSent(true);
        } else {
          setError('reset', 'reset', `We weren't able to reset your password. Try again and if that doesn't work get in touch with us.`);
        }
      });
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-300 rounded-sm px-8 pt-6 pb-8 mb-4">
      <div className="mb-5 text-center">
        Let&apos;s reset your password!
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8">
          <label className="hidden" htmlFor="email">
            Email
          </label>

          <input
            className={`border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.email && 'focus:border-primary'} placeholder-gray-400 ${errors.email && 'border-red-600'}`}
            id="username"
            placeholder="Email"
            type="email"
            name="email"
            ref={register({
              required: 'Please enter your email',
              pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: `The email you entered doesn't seem to be valid`,
              },
            })}
          />
          <span className="tracking-wide text-primary text-xs font-bold">{errors.email && errors.email.message}</span>
          <span className="tracking-wide text-primary text-xs font-bold">{errors.reset && errors.reset.message}</span>
          <span className="block tracking-wide text-xs font-bold mt-2">{resetSent && `You've got email! If your account is valid you should be able to reset your password now.`}</span>
        </div>

        <div className="flex items-center md:justify-between justify-center">
          <Button className="w-full md:w-auto">
            {
              loading
                ? <FaSpinner className="w-full icon-spin" />
                : 'Reset Password'
            }
          </Button>

          <a className="inline-block align-baseline text-sm hidden md:block text-black" onClick={setFormToLogin}>
            Back to login
          </a>
        </div>

        <div className="text-center mt-3 md:hidden">
          <a className="text-sm text-black" onClick={setFormToLogin}>
            Login
          </a>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
