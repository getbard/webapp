import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useLazyQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import firebase from '../lib/firebase';

import { withApollo } from '../lib/apollo';
import AuthLinkQuery from '../queries/AuthLinkQuery';

import withLayout from '../components/withLayout';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import Button from '../components/Button';


type FormData = {
  password: string;
  passwordConfirmation: string;
};

type Mode = {
  title: string;
  handler: (data?: FormData) => void;
}

const ResetPassword: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const [displayResetPassword, setDisplayResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [called, setCalled] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const { register, handleSubmit, errors, watch } = useForm<FormData>();

  const handleResetPassword = (data: FormData | undefined): void => {
    const { password } = data || {};

    if (!password) {
      return;
    }

    setLoading(true);
    
    firebase.auth().confirmPasswordReset(router?.query?.oobCode as string, password)
      .then(() => {
        setLoading(false);

        firebase.auth().signInWithEmailAndPassword(email, password);

        setSuccess(`You're password has been reset! Time to find your next great read.`);
      })
      .catch(() => {
        window.analytics.track('AUTH: Password reset failed');

        setError(`We weren't able to reset your password. Please try again later.`);
      });
  }

  const handleVerifyEmail = (): void => {
    setCalled(true);

    firebase.auth().applyActionCode(router?.query?.oobCode as string)
      .then(() => {
        window.analytics.track('AUTH: Verify email succeeded');

        setSuccess('Your email has been verified. Time to publish your first article!');
      })
      .catch((error) => {
        window.analytics.track('AUTH: Verify email failed');

        if (error.message === 'INVALID_OOB_CODE') {
          setError('Your verification code is invalid. Has this link already been used?');
        } else {
          setError(`We weren't able to verify your email. Please try again later.`);
        }
      });
  }

  const modes: { [key: string]: Mode } = {
    resetPassword: {
      handler: handleResetPassword,
      title: 'Reset Password',
    },
    verifyEmail: {
      handler: handleVerifyEmail,
      title: 'Verify Email',
    },
  }

  const mode = modes[router?.query?.mode as string] || { title: 'Invalid Auth URL' };

  // Call the verification handler immediately
  if (mode.title === 'Verify Email' && typeof window !== 'undefined' && !called) {
    mode.handler();
  } else if (mode.title === 'Reset Password' && !displayResetPassword) {        
    firebase.auth().verifyPasswordResetCode(router?.query?.oobCode as string)
      .then((email) => {
        setDisplayResetPassword(true);
        setEmail(email);
      })
      .catch((error) => {
        window.analytics.track('AUTH: Password reset failed');

        if (error.message === 'INVALID_OOB_CODE') {
          setError('Your password reset code is invalid. Has this link already been used?');
        } else {
          setError(`We weren't able to reset your password. Please try again later.`);
        }
      });
  }

  return (
    <>
      <NextSeo
        title={mode.title}
        description="Handle auth actions for your Bard account."
      />

      <div className="sm:w-3/5 px-5 pt-5 pb-40 container mx-auto relative">
        <PageHeader>
          {mode.title}
        </PageHeader>

        <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm">
          {
            displayResetPassword && (
              <form onSubmit={handleSubmit(handleResetPassword)}>
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
                </div>

                <Button loading={loading}>
                  Reset Password
                </Button>
              </form>
            )
          }
          
          {
            success && (
              <div>
                <div className="font-bold mb-2">
                  Success!
                </div>

                <div>
                  {success}
                </div>
              </div>
            )
          }

          {
            error && (
              <div>
                <div className="font-bold mb-2">
                  Sadness...
                </div>

                <div>
                  {error}
                </div>
              </div>
            )
          }
        </div>
      </div>

      <Footer />  
    </>
  );
}

export default withApollo()(withLayout(ResetPassword));
