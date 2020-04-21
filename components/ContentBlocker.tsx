import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';

import { User } from '../generated/graphql';

import { useAuth } from '../hooks/useAuth';

import ButtonLink from './ButtonLink';
import BecomeSupporterButton from './BecomeSupporterButton';

const GradientBlocker = styled.div`
  width: 100%;
  background: linear-gradient(0deg, rgba(255,255,255,1) 20%, rgba(255,255,255,0) 100%);
`;

const ContentBlocker = ({ author }: { author: User }): React.ReactElement => {
  const auth = useAuth();
  const router = useRouter();
  const buttonText = auth.userId ? `Support ${author.firstName} to read this article` : 'Create an account to read this article';
  const buttonHref = auth.userId ? `/${author.username}?support=true` : '/signup';

  if (typeof window !== 'undefined') {
    window.analytics.track('CONTENT BLOCKER: Blocked article viewed', { page: router.asPath });
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0">
      <GradientBlocker className="h-full w-full" />

      <div className="bg-white flex flex-col justify-center items-center pb-10 pt-0 -mt-16">
        <div className="mb-2">
          {author.firstName} has made this content available to supporters only.
        </div>

        {
          auth.user && author.stripeUserId && author.stripePlan
            ? <BecomeSupporterButton author={author} />
            : (
              <ButtonLink
                href={buttonHref}
                trackEvent={`CONTENT BLOCKER: ${buttonText} clicked`}
              >
                {buttonText}
              </ButtonLink>
            )
        }

        {
          !auth.userId && (
            <div className="mt-2">
              Already a supporter?&nbsp;
              <Link href={`/login?redirect=${router.asPath}`}>
                <a
                  className="underline"
                  onClick={(): void => window.analytics.track('CONTENT BLOCKER: Login to read clicked', { page: router.asPath })}
                >
                  Login to read
                </a>
              </Link>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default ContentBlocker;
