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
  sent: string;
};

const ResetPassword: NextPage = (): React.ReactElement => {
  const [verificationSent, setVerificationSent] = useState(false);
  const { register, handleSubmit, errors, setError } = useForm<FormData>();
  const [sendEmailVerificationEmail, { loading, data, error, called }] = useLazyQuery(AuthLinkQuery);

  useEffect(() => {
    if (called && error) {
      setError('sent', 'sent', `We weren't able to send you a verification email. Try again and if that doesn't work get in touch with us.`);
    }
  }, [error]);

  useEffect(() => {
    if (called && !error) {
      setVerificationSent(true);
    }
  }, [data]);

  const onSubmit = ({ email }: FormData): void => {
    window.analytics.track('RESET PASSWORD: Requested password', { email });

    sendEmailVerificationEmail({
      variables: { type: 'emailVerification', email },
    });
  };

  return (
    <>
      <NextSeo
        title="Verify Email"
        description="Verify your email so you can publish on Bard."
      />

      <div className="sm:w-3/5 px-5 pt-5 pb-40 container mx-auto relative">
        <PageHeader>
          Verify Email
        </PageHeader>

        <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm">
          <div className="mb-4">
            Enter your email and we will send a link for you to verify your email.
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="hidden" htmlFor="email">
                Email
              </label>

              <input
                className={`shadow-inner border rounded-sm w-full py-2 px-3 focus:outline-none ${!errors.email && 'focus:border-primary'} placeholder-gray-500 ${errors.email && 'border-red-600'}`}
                onChange={(): void => setVerificationSent(false)}
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
              <span className="text-red-600 text-xs font-bold">{errors.sent && errors.sent.message}</span>
              <span className="text-primary block text-xs font-bold mt-2">{verificationSent && `You've got email! If that email is valid you should be able to verify it now.`}</span>
            </div>

            <div className="flex items-center md:justify-between justify-center">
              <Button
                className="w-full md:w-auto"
                loading={loading}
                trackEvent="VERIFY EMAIL: Verify Email clicked"
              >
                Verify Email
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
