import { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import { withApollo } from '../lib/apollo';

import LoginForm from '../components/LoginForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

const formComponents: {
  [index: string]: React.FC<{ setForm: React.Dispatch<React.SetStateAction<string>> }>;
} = {
  login: LoginForm,
  forgotPassword: ForgotPasswordForm,
};

const Login: NextPage = (): React.ReactElement => {
  const [form, setForm] = useState('login');
  const Component = formComponents[form];

  return (
    <div className="flex flex-col justify-center items-center pt-16 p-4">
      <NextSeo
        title="Login"
        description="Login to find your next favorite read."
      />

      <div className="pb-5">
        <Link href="/">
          <a className="logo font-extrabold text-4xl text-primary font-serif">
            bard.
          </a>
        </Link>
      </div>

      <Component setForm={setForm} />

      <p className="text-center text-sm">
        Don&apos;t have an account?&nbsp;
        <Link href="/signup">
          <a className="text-black">
            Sign Up
          </a>
        </Link>
      </p>
    </div>
  );
};

export default withApollo()(Login);
 