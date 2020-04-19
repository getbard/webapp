import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { useAuth } from '../hooks/useAuth';

import { withApollo } from '../lib/apollo';
import SignupForm from '../components/SignupForm';

const Signup: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const auth = useAuth();

  if (auth.user) {
    router.push('/');
  }

  return (
    <div>
      <NextSeo
        title="Sign Up"
        description="Join the writing revolution. Support amazing writers today!"
      />

      <SignupForm />
    </div>
  );
};

export default withApollo()(Signup);
 