import { NextPage } from 'next';
import { useRouter } from 'next/router';

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
      <SignupForm />
    </div>
  );
};

export default withApollo()(Signup);
 