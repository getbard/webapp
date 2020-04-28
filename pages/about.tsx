import { NextPage } from 'next';
import styled from '@emotion/styled';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import { withApollo } from '../lib/apollo';

import withLayout from '../components/withLayout';
import Footer from '../components/Footer';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import Pencil from '../public/pencil.svg';

const Container = styled.div`
  &:after {
    content: "";
    background-image: url(../about-blob.svg);
    top: 0;
    left: -100vh;
    bottom: 0;
    right: -100vh;
    position: absolute;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -1;
  }
`;

const SectionContainer = styled.div`
  background-image: url(../about-blob.svg);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const BottomSvg = styled.div`
  background-image: url(../about-blob-bottom.svg);
  background-size: cover;
  background-repeat: no-repeat;
  height: 20rem;
`;

const About: NextPage = (): React.ReactElement => {
  return (
    <>
      <NextSeo
        title="About"
        description="Quality writing rarely earns you cash. Until now."
      />

      <Container className="overflow-x-hidden relative pt-10">
        {/* Hero */}
        <div className="min-h-screen flex flex-col justify-between container mx-auto px-10">
          <section className="flex items-center pb-20 md:pb-48 lg:px-10 text-white">
            <div className="md:w-1/2 inline-block z-10">
              <div className="font-bold text-3xl xl:text-4xl font-serif">Better for writers. </div>
              <div className="font-extrabold text-3xl xl:text-4xl font-serif">Better for readers.</div>

              <p className="text-xl xl:text-2xl my-10">On Bard, writers are supported by the readers. This means that readers have the power to support the writing they love. And writers get paid for it.</p>

              <Link href="/signup">
                <a
                  className="text-center mb-2 lg:mr-4 block lg:inline bg-white hover:shadow-xl hover:bg-secondary text-primary text-3xl transition duration-150 ease-in-out px-5 py-3 rounded-sm"
                  onClick={(): void => window.analytics.track('ABOUT: Header Start writing clicked')}
                >
                  Start writing
                </a>
              </Link>

              <Link href="/">
                <a
                  className="text-center block lg:inline bg-white hover:shadow-xl hover:bg-secondary text-primary text-3xl transition duration-150 ease-in-out px-5 py-3 rounded-sm"
                  onClick={(): void => window.analytics.track('ABOUT: Header Start reading clicked')}
                >
                  Start reading
                </a>
              </Link>
            </div>

            <div className="md:w-1/2">
              <Pencil />
            </div>
          </section>
        </div>
      </Container>

      <SectionContainer className="z-20 relative">
        <div className="sm:w-3/5 px-5 py-5 container mx-auto -mt-40 text-lg">
          <section className="p-4 border border-gray-300 rounded-sm shadow-xl bg-white mb-10">
            <div className="font-bold text-3xl xl:text-4xl font-serif">
              Why Bard?
            </div>

            <p className="mb-4">
              Something about writing online just isn&apos;t right.
            </p>

            <ul className="list-disc px-5 mb-4">
              <li className="mb-2">Clickbait reduces quality.</li>
              <li className="mb-2">Advertisers and editors shape content more than writers.</li>
              <li className="mb-2">Readers have no power to influence they content they see.</li>
              <li className="mb-2">Great writers are struggling to make money.</li>
            </ul>

            <p className="mb-4">
              Here&apos;s what we plan to do about that.
            </p>
          </section>

          <section className="md:grid grid-cols-2 gap-4 md:-ml-40 md:-mr-40 mb-10">
            <div className="col-span-1 p-4 border border-gray-300 rounded-sm shadow-xl bg-white mb-10 md:mb-0">
              <div className="font-bold text-3xl xl:text-4xl font-serif">
                Our Vision for Readers
              </div>

              <p className="mb-4">
                Readers should have the power to reward and incentivize the content they love.
              </p>

              <ul className="list-disc px-5 mb-4">
                <li className="mb-2">We’re taking the power away from the advertisers and publications and giving it to the readers.</li>
                <li className="mb-2">Readers get to reward the content they love so that they get more of it.</li>
                <li className="mb-2">Readers can interact with the writers they love so they can be active players in what gets created.</li>
              </ul>
            </div>

            <div className="col-span-1 p-4 border border-gray-300 rounded-sm shadow-xl bg-white mb-10 md:mb-0">
              <div className="font-bold text-3xl xl:text-4xl font-serif">
                Our Vision for Writers
              </div>

              <p className="mb-4">
                Writers should provide value for their readers, rather than aiming to please advertisers, curators, or algorithms.
              </p>

              <ul className="list-disc px-5 mb-4">
                <li className="mb-2">Writers should get paid when they deliver what their readers crave.</li>
                <li className="mb-2">Writers should focus on their writing, not on creating websites or products.</li>
                <li className="mb-2">It’s not about the size of the audience but how passionate they are.</li>
              </ul>
            </div>
          </section>

          <section className="p-4 border border-gray-300 rounded-sm shadow-xl bg-white mb-10 z-50">
            <div className="font-bold text-3xl xl:text-4xl font-serif">
              How Bard Works
            </div>

            <p className="mb-4">
              Anyone can write on Bard.
            </p>

            <p className="mb-4">
              Authors choose which content is accessible and which to put behind a paywall. The choice is theirs. Readers show their support for writers in one-time donations or in monthly subscriptions.
            </p>

            <p className="mb-4 bg-gray-200 italic text-xl font-serif p-4 border-l-4 border-primary">
              &quot;A society that has no respect, no regard for its bards, its historians, its storytellers, is a society in steep decline, a society that has lost its very soul and may never find its way.&quot;
            </p>

            <p className="mb-4">
            Let&apos;s rally behind the writers that are bringing us value. Because bards, historians, and storytellers matter.
            </p>
          </section>
        </div>
      </SectionContainer>


      <div className="text-center my-10 mb-20 md:mb-10">
        <Link href="/signup">
          <a
            className="inline-block mb-2 mr-2 mx-auto bg-primary hover:shadow-xl hover:bg-secondary text-white text-3xl transition duration-150 ease-in-out px-5 py-3 rounded-sm"
            onClick={(): void => window.analytics.track('ABOUT: Bottom Start writing clicked')}
          >
            Start writing
          </a>
        </Link>

        <Link href="/">
          <a
            className="inline-block mx-auto bg-primary hover:shadow-xl hover:bg-secondary text-white text-3xl transition duration-150 ease-in-out px-5 py-3 rounded-sm"
            onClick={(): void => window.analytics.track('ABOUT: Bottom Start reading clicked')}
          >
            Start reading
          </a>
        </Link>
      </div>

      <BottomSvg className="-mt-40 hidden md:block" />

      <Footer />
    </>
  );
}

export default withApollo()(withLayout(About));
