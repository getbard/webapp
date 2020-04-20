import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useLazyQuery } from '@apollo/react-hooks';

import { withApollo } from '../lib/apollo';
import AuthLinkQuery from '../queries/AuthLinkQuery';

import withLayout from '../components/withLayout';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import Button from '../components/Button';

type FormData = {
  email: string;
  reset: string;
};

const ResetPassword: NextPage = (): React.ReactElement => {
  const [resetSent, setResetSent] = useState(false);
  const { register, handleSubmit, errors, setError } = useForm<FormData>();
  const [sendResetPasswordEmail, { loading, data, error, called }] = useLazyQuery(AuthLinkQuery);

  useEffect(() => {
    if (called && error) {
      setError('reset', 'reset', `We weren't able to send a reset password email. Try again and if that doesn't work get in touch with us.`);
    }
  }, [error]);

  useEffect(() => {
    if (called && !error) {
      setResetSent(true);
    }
  }, [data]);

  const onSubmit = ({ email }: FormData): void => {
    window.analytics.track('RESET PASSWORD: Requested password', { email });
    sendResetPasswordEmail({
      variables: { type: 'passwordReset', email },
    });
  };

  return (
    <>
      <NextSeo
        title="Reset Password"
        description="Reset your password. Make sure you pick something secure!"
      />

      <div className="sm:w-3/5 px-5 pt-5 pb-40 container mx-auto relative">
        <PageHeader>
          Reset Password
        </PageHeader>

        <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm">
          <div className="mb-4">
            Enter your email and we will send a link for you to reset your password.
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="hidden" htmlFor="email">
                Email
              </label>

              <input
                className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.email && 'focus:border-primary'} placeholder-gray-500 ${errors.email && 'border-red-600'}`}
                onChange={(): void => setResetSent(false)}
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
              <span className="text-red-600 text-xs font-bold">{errors.email && errors.email.message}</span>
              <span className="text-red-600 text-xs font-bold">{errors.reset && errors.reset.message}</span>
              <span className="text-primary block text-xs font-bold mt-2">{resetSent && `You've got email! If that email is valid you should be able to reset your password now.`}</span>
            </div>

            <div className="flex items-center md:justify-between justify-center">
              <Button
                className="w-full md:w-auto"
                loading={loading}
                trackEvent="RESET PASSWORD: Reset Password clicked"
              >
                Reset Password
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />  
    </>
  );
}

export default withApollo()(withLayout(ResetPassword));
