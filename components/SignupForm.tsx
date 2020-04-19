import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/react-hooks';

import { useAuth } from '../hooks/useAuth';

import Button from './Button';

import { CreateUserInput } from '../generated/graphql';
import CreateUserMutation from '../queries/CreateUserMutation';

type FormData = {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  signup: string;
};

function SignupUser(): React.ReactElement {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, errors, setError, watch } = useForm<FormData>();
  const [createUser] = useMutation<CreateUserInput>(CreateUserMutation);

  useEffect(() => {
    if (auth.user !== null){
      window.analytics.track('SIGNUP FORM: Redirected');
      router.push('/');
    }
  }, [auth]);

  const onSubmit = ({
    email,
    firstName,
    lastName,
    password,
  }: FormData): void => {
    setLoading(true);

    window.analytics.track('SIGNUP FORM: Sign up clicked');

    auth
      .signUp(email, password)
      .then((user) => {
        createUser({
          variables: {
            input: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              id: user?.uid,
              email,
              firstName,
              lastName,
            },
          },
        });
        router.push('/');
      })
      .catch(() => {
        setLoading(false);
        setError('signup', 'signup', `We weren't able to create your account. Try again and if that doesn't work get in touch with us.`);
      });
  }

  return (
    <div className="flex justify-center p-4 pt-16">
      <div className="mr-20 max-w-md px-20 hidden md:block">
        <div className="pb-8">
          <Link href="/">
            <a className="logo font-extrabold text-4xl text-primary font-serif">
              bard.
            </a>
          </Link>
        </div>

        <div className="text-sm">
          <div className="pb-5">
            <p className="font-bold pb-2 text-black">Directly support writers</p>
            <p>Support and interact with the writers you love through one-time donations and monthly subscriptions.</p>
          </div>

          <div className="pb-5">
            <p className="font-bold pb-2 text-black">Earn money from your words</p>
            <p>Get rewarded based on the value you provide, not on how many clicks you get. The end of clickbait has arrived.</p>
          </div>

          <div className="pb-5">
            <p className="font-bold pb-2 text-black">Enjoy creative freedom</p>
            <p>Unleash your own voice. No algorithm determines how you get paid, your audience does. Bard gives you the infrastructure you need to focus on what matters most: your writing.</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center font-extrabold md:hidden">
          <Link href="/">
            <a className="logo font-extrabold text-4xl text-primary font-serif">
              bard.
            </a>
          </Link>
        </div>

        <div className="bg-white border border-gray-300 rounded-sm px-8 pt-6 pb-8 mb-4">
          <div className="mb-5 text-center">
            Join the writing revolution
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="hidden" htmlFor="email">
                Email
                </label>

              <input
                className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.email && 'focus:border-primary'} placeholder-gray-500 ${errors.email && 'border-red-600'}`}
                id="email"
                placeholder="e.hemingway@hemingwayapp.com"
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

            <div className="mb-4">
              <label className="hidden" htmlFor="first-name">
                First Name
                </label>

              <input
                className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.firstName && 'focus:border-primary'} placeholder-gray-500 ${errors.firstName && 'border-red-600'}`}
                id="first-name"
                type="text"
                placeholder="Ernest"
                name="firstName"
                ref={register({ required: 'Please enter your first name' })}
              />
              <span className="text-red-600 text-xs font-bold">{errors.firstName && errors.firstName.message}</span>
            </div>

            <div className="mb-6">
              <label className="hidden" htmlFor="last-name">
                Last Name
                </label>

              <input
                className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none focus:border-primary placeholder-gray-500`}
                id="last-name"
                type="text"
                placeholder="Hemingway"
                name="lastName"
                ref={register}
              />
            </div>

            <div className="mb-4">
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
                  minLength: { value: 12, message: 'It\'s best if your password is at least 12 characters long' },
                })}
              />
              <span className="text-red-600 text-xs font-bold">{errors.password && errors.password.message}</span>
            </div>

            <div className="mb-6">
              <label className="hidden" htmlFor="confirm-password">
                Confirm Password
                </label>

              <input
                className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.passwordConfirmation && 'focus:border-primary'} placeholder-gray-500 ${errors.passwordConfirmation && 'border-red-600'}`}
                id="confirm-password"
                type="password"
                placeholder="Confirm Password"
                name="passwordConfirmation"
                ref={register({
                  required: 'Please confirm your super secure password',
                  validate: passwordConfirmation => passwordConfirmation === watch('password') || 'The confirmation password does not match your password',
                })}
              />
              <span className="text-red-600 text-xs font-bold">{errors.passwordConfirmation && errors.passwordConfirmation.message}</span>
              <span className="text-red-600 text-xs font-bold">{errors.signup && errors.signup.message}</span>
            </div>

            <div className="flex items-center justify-center focus:outline-none">
              <Button className="w-full" loading={loading}>
                Sign Up
              </Button>
            </div>
          </form>
        </div>

        <div>
          <p className="text-center text-sm">
            Already have an account?&nbsp;
            <Link href="/login">
              <a
                className="text-black"
                onClick={(): void => window.analytics.track('SIGNUP FORM: Login clicked')}
              >
                Login
              </a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupUser;
