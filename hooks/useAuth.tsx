import { useState, useEffect, useContext, createContext } from 'react';
import firebase from '../lib/firebase';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';

type AuthContext = {
  user: firebase.User | null;
  userId: string | null | undefined;
  signIn: (email: string, password: string) => Promise<firebase.auth.UserCredential | firebase.User | null>;
  signUp: (email: string, password: string) => Promise<firebase.auth.UserCredential | firebase.User | null>;
  signOut: () => Promise<boolean | void>;
  sendPasswordResetEmail: (email: string) => Promise<boolean | void>;
  confirmPasswordReset: (code: string, password: string) => Promise<boolean | void>;
}

const fbSignIn = (email: string, password: string): Promise<firebase.auth.UserCredential | firebase.User | null> => firebase.auth().signInWithEmailAndPassword(email, password);
const fbSignUp = (email: string, password: string): Promise<firebase.auth.UserCredential | firebase.User | null> => firebase.auth().createUserWithEmailAndPassword(email, password);
const fbSignOut = (): Promise<boolean | void> => firebase.auth().signOut();
const fbSendPasswordResetEmail = (email: string): Promise<boolean | void> => firebase.auth().sendPasswordResetEmail(email);
const fbConfirmPasswordReset = (code: string, password: string): Promise<boolean | void> => firebase.auth().confirmPasswordReset(code, password);

const authContext = createContext<AuthContext>({
  user: null,
  userId: null,
  signIn: fbSignIn,
  signUp: fbSignUp,
  signOut: fbSignOut,
  sendPasswordResetEmail: fbSendPasswordResetEmail,
  confirmPasswordReset: fbConfirmPasswordReset,
});

function useAuthContext(ctxUserId: string): AuthContext {
  const router = useRouter();
  const defaultUserId = typeof window === 'undefined' ? null : cookie.get('uid');
  const [userId, setUserId] = useState(defaultUserId || ctxUserId || null);
  const [user, setUser] = useState<firebase.User | null>(null);

  const signIn = (
    email: string,
    password: string,
  ): Promise<firebase.auth.UserCredential | firebase.User | null> => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signUp = (
    email: string,
    password: string,
  ): Promise<firebase.auth.UserCredential | firebase.User | null> => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signOut = (): Promise<void> => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        router.push('/');
      });
  };

  const sendPasswordResetEmail = (email: string): Promise<boolean | void> => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (code: string, password: string): Promise<boolean | void> => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any
  // component that utilizes this hook to re-render with the
  // latest auth object
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        setUser(user);
        setUserId(user.uid);
        const token = await user.getIdToken();
        cookie.set('token', token);
        cookie.set('uid', user.uid);
      } else {
        setUser(null);
        setUserId(null);
        cookie.remove('token');
        cookie.remove('uid');
      }
    });

    return (): void => unsubscribe();
  }, []);

  return {
    user,
    userId,
    signIn,
    signUp,
    signOut,
    sendPasswordResetEmail,
    confirmPasswordReset
  };
}

export function AuthProvider({ children, userId }: React.PropsWithChildren<{userId: string}>): React.ReactElement {
  const auth = useAuthContext(userId);

  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = (): AuthContext => {
  return useContext(authContext);
};