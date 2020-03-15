import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

type FormData = {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  signup: string;
};

const SignupUser = (): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, errors, setError, watch } = useForm<FormData>();

  useEffect(() => {
    if (auth.user !== null){
      router.push('/');
    }
  }, [auth]);

  const onSubmit = ({ email, password }: FormData): void => {
    setLoading(true);

    auth
      .signUp(email, password)
      .then(() => {
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
            <p className="font-bold pb-2 text-black">Read the Internet&apos;s best writing</p>
            <p>Build your writing habit by one day at a time. Set a daily goal and work your way up to it.</p>
          </div>

          <div className="pb-5">
            <p className="font-bold pb-2 text-black">Directly support writers</p>
            <p>For every 7 day streak you maintain, we donate a dollar to mental health research.</p>
          </div>

          <div className="pb-5">
            <p className="font-bold pb-2 text-black">Earn money with your work</p>
            <p>See if you like us, risk free. After 30 days, subscribe monthly for the price of a coffee.</p>
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
                className={`border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.email && 'focus:border-primary'} placeholder-gray-400 ${errors.email && 'border-red-600'}`}
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
              <span className="tracking-wide text-primary text-xs font-bold">{errors.email && errors.email.message}</span>
            </div>

            <div className="mb-4">
              <label className="hidden" htmlFor="first-name">
                First Name
                </label>

              <input
                className={`border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.firstName && 'focus:border-primary'} placeholder-gray-400 ${errors.firstName && 'border-red-600'}`}
                id="first-name"
                type="text"
                placeholder="Ernest"
                name="firstName"
                ref={register({ required: 'Please enter your name' })}
              />
              <span className="tracking-wide text-primary text-xs font-bold">{errors.firstName && errors.firstName.message}</span>
            </div>

            <div className="mb-6">
              <label className="hidden" htmlFor="last-name">
                Last Name
                </label>

              <input
                className={`border rounded-sm w-full py-2 px-3 focus:outline-none focus:border-primary placeholder-gray-400`}
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
                className={`border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.password && 'focus:border-primary'} placeholder-gray-400 ${errors.password && 'border-red-600'}`}
                id="password"
                type="password"
                placeholder="Password"
                name="password"
                ref={register({
                  required: 'Please enter a password',
                  minLength: { value: 12, message: 'It\'s best if your password is at least 12 characters long' },
                })}
              />
              <span className="tracking-wide text-primary text-xs font-bold">{errors.password && errors.password.message}</span>
            </div>

            <div className="mb-6">
              <label className="hidden" htmlFor="confirm-password">
                Confirm Password
                </label>

              <input
                className={`border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.passwordConfirmation && 'focus:border-primary'} placeholder-gray-400 ${errors.passwordConfirmation && 'border-red-600'}`}
                id="confirm-password"
                type="password"
                placeholder="Confirm Password"
                name="passwordConfirmation"
                ref={register({
                  required: 'Please confirm your super secure password',
                  validate: passwordConfirmation => passwordConfirmation === watch('password') || 'The confirmation password does not match your password',
                })}
              />
              <span className="tracking-wide text-primary text-xs font-bold">{errors.passwordConfirmation && errors.passwordConfirmation.message}</span>
              <span className="tracking-wide text-primary text-xs font-bold">{errors.signup && errors.signup.message}</span>
            </div>

            <div className="flex items-center justify-center">
              <button
                className="bg-primary w-full hover:bg-secondary text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {
                  loading
                    ? <FaSpinner className="w-full icon-spin" />
                    : 'Sign Up'
                }
              </button>
            </div>
          </form>
        </div>

        <div>
          <p className="text-center text-sm">
            Already have an account?&nbsp;
              <Link href="/login">
              <a className="text-black">
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
