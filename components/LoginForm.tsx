import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import Button from './Button';

type FormData = {
  email: string;
  password: string;
  login: string;
};

function LoginForm({
  setForm
}: {
  setForm: React.Dispatch<React.SetStateAction<string>>;
}): React.ReactElement {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, errors, setError } = useForm<FormData>();
  const redirect = router?.query?.redirect as string || '/';

  const setFormToForgotPassword = (): void => {
    window.analytics.track('LOGIN FORM: Forgot password clicked')
    setForm('forgotPassword');
  };

  useEffect(() => {
    if (auth.user !== null){
      window.analytics.track('LOGIN FORM: Redirected', { redirect });
      router.push(redirect);
    }
  }, [auth]);

  const onSubmit = ({ email, password }: FormData): void => {
    setLoading(true);

    auth
      .signIn(email, password)
      .then(() => {
        router.push('/');
      })
      .catch(() => {
        setLoading(false);
        setError('login', 'login', `We weren't able to log you in. Try again and if that doesn't work you could try resetting your password.`);
      });
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-300 rounded-sm px-8 pt-6 pb-8 mb-4">
      <div className="mb-5 text-center">
        Welcome back!
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="hidden" htmlFor="email">
            Email
          </label>

          <input
            className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.email && 'focus:border-primary'} placeholder-gray-500 ${errors.email && 'border-red-600'}`}
            id="email"
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
          <span className="text-red-600 text-xs font-bold">{errors.email && errors.email.message}</span>
        </div>

        <div className="mb-8">
          <label className="hidden" htmlFor="password">
            Password
          </label>

          <input
            className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.password && 'focus:border-primary'} placeholder-gray-500 ${errors.password && 'border-red-600'}`}
            id="password"
            type="password"
            placeholder="Password"
            name="password"
            ref={register({
              required: 'Please enter a password',
            })}
          />
          <span className="text-red-600 text-xs font-bold">{errors.password && errors.password.message}</span>
          <span className="text-red-600 text-xs font-bold">{errors.login && errors.login.message}</span>
        </div>

        <div className="flex items-center md:justify-between justify-center">
          <Button
            className="w-full md:w-auto"
            loading={loading}
            trackEvent="LOGIN FORM: Login clicked"
          >
            Login
          </Button>

          <a className="inline-block align-baseline text-sm hidden md:block text-black" onClick={setFormToForgotPassword}>
            Forgot your password?
          </a>
        </div>

        <div className="text-center mt-3 md:hidden">
          <a className="text-sm text-black" onClick={setFormToForgotPassword}>
            Forgot your password?
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
