import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import styled from '@emotion/styled';
import * as firebase from 'firebase/app';
import firebaseAuth from '../lib/firebase';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

const FbButton = styled.button`
  &:hover {
    background: #4267B2;
    border-color: #4267B2;
    color: white;
  }
`;

const GoogleButton = styled.button`
  &:hover {
    background: #4285F4;
    border-color: #4285F4;
    color: white;
  }
`;

function SocialMediaLogin({
  setError,
  setPendingCred,
  signup = false,
}: {
  setError: (name: any, type: string, message: string) => void;
  setPendingCred?: (pendingCred: any | null) => void;
  signup?: boolean;
}): React.ReactElement {
  const auth = useAuth();
  const router = useRouter();
  const errorName = signup ? 'signup' : 'login';
  const actionText = signup ? 'Join' : 'Login';

  const onSocialLogin = (provider: firebase.auth.AuthProvider): void => {
    auth
      .signInWithProvider(provider)
      .then(() => {
        router.push('/');
      })
      .catch((error) => {
        if (setError) {
          if (error?.code === 'auth/account-exists-with-different-credential') {
            window.analytics.track('SOCIAL MEDIA LOGIN: Account exists with different credential', {
              isOnSignupPage: signup,
            });

            const pendingCred = error.credential;
            const email = error.email;

            if (!setPendingCred) {
              setError(errorName, errorName, 'You previously signed in with an email and password.');
              return;
            }

            // They previously logged in
            firebaseAuth.auth().fetchSignInMethodsForEmail(email).then(methods => {
              // Used an email/password before; prompt for proper login
              if (methods[0] === 'password') {
                setPendingCred(pendingCred);
                setError(errorName, errorName, 'You previously signed in with an email and password. Enter your email and password so we can link your accounts.');
                return;
              }

              // Get them to login with their previous method
              // Must be one of Facebook or Google
              const prevProvider = methods[0] === firebase.auth.FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD
                ? new firebase.auth.FacebookAuthProvider()
                : new firebase.auth.GoogleAuthProvider();

              auth
                .signInWithProvider(prevProvider, pendingCred)
                .then(() => {
                  router.push('/');
                })
                .catch(() => {
                  setError(errorName, errorName, `We weren't able to log you in. Try again and if that doesn't work you could try resetting your password.`);
                })
            });
          } else {
            setError(errorName, errorName, `We weren't able to log you in. Try again and if that doesn't work you could try resetting your password.`);
          }
        }
      });
  }
  
  return (
    <div className="flex justify-between">
      <FbButton
        className="flex items-center px-4 py-2 rounded border border-gray-300 transition duration-150 ease-in focus:outline-none"
        onClick={(): void => {
          window.analytics.track('SOCIAL MEDIA LOGIN: Facebook clicked', { isOnSignupPage: signup });
          onSocialLogin(new firebase.auth.FacebookAuthProvider());
        }}
      >
        <FaFacebookF className="mr-1" /> {actionText} with Facebook
      </FbButton>

      <GoogleButton
        className="flex items-center px-4 py-2 rounded border border-gray-300 transition duration-150 ease-in focus:outline-none"
        onClick={(): void => {
          window.analytics.track('SOCIAL MEDIA LOGIN: Google clicked', { isOnSignupPage: signup });
          onSocialLogin(new firebase.auth.GoogleAuthProvider());
        }}
      >
        <FaGoogle className="mr-1" /> {actionText} with Google
      </GoogleButton>
    </div>
  );
}

export default SocialMediaLogin;
