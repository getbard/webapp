import { NextPage } from 'next';
// import { useRouter } from 'next/router';

import SignupForm from '../components/SignupForm';

const Signup: NextPage = (): React.ReactElement => {
//   const router = useRouter();
//   const authUser = useStoreState(state => state.user);

//   if (authUser.isAuthenticated) {
//     router.push('/write');
//   }

  return (
    <div>
      <SignupForm />
    </div>
  );
};

export default Signup;
 