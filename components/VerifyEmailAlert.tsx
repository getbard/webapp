import { useState } from 'react';

import { useAuth } from '../hooks/useAuth';

function VerifyEmailAlert(): React.ReactElement {
  const auth = useAuth();
  const [verificationSent, setVerificationSent] = useState(false);

  const sendEmailVerification = (): void => {
    if (!verificationSent) {
      auth.user?.sendEmailVerification();
      setVerificationSent(true);
    }
  };

  return (
    <>
    {
      auth?.user?.emailVerified === false && (
        <div className="bg-primary text-white text-center py-4 sticky top-0 z-20 -mt-5">
          {
            verificationSent
              ? (
                <span>
                  You&apos;ve got mail! Verify your email and you&apos;ll be good to go.
                </span>
              )
              : (
                <>
                  <span>
                    You will need to verify your email prior to publishing. Didn&apos;t get an email?&nbsp;
                  </span>
            
                  <span
                    className="hover:cursor-pointer underline hover:text-secondary"
                    onClick={sendEmailVerification}
                  >
                    Click here and we&apos;ll send it again.
                  </span>
                </>
              )
          }
        </div>
      )
    }
    </>
  );
}

export default VerifyEmailAlert;
