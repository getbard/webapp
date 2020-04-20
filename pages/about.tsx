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
              <h1 className="font-bold text-3xl xl:text-4xl md:inline font-serif">Quality writing rarely earns you cash.</h1>
              &nbsp;<h1 className="font-extrabold text-3xl xl:text-4xl md:inline underline font-serif">Until now.</h1>

              <p className="text-xl xl:text-2xl my-10">Whether you have a large audience, starting from scratch, or something in-between, we let you focus on writing — we handle the rest.</p>

              <Link href="/signup">
                <a
                  className="bg-white hover:shadow-xl hover:bg-secondary text-primary text-3xl button transition duration-150 ease-in-out px-5 py-3 rounded-sm"
                  onClick={(): void => window.analytics.track('ABOUT: Header Start writing clicked')}
                >
                  Start writing
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
              Something about writing online just isn&apos;t right. Good writers are writing about things they’re not passionate about. They’re using clickbait or altering their message to please curators and publications. Some are being forced to publish over four times per week, focusing on quantity over quality.
            </p>

            <p className="mb-4">
              And when they provide value, they’re not getting compensated for it. A writer today could write an article for a publication that goes viral, without getting any piece of the revenue.
            </p>

            <p className="mb-4">
              Writers should be incentivized to provide value for their readers, rather than aiming to please advertisers, curators, or obscure revenue-sharing algorithms.
            </p>

            <p className="mb-4">
              And readers, who are currently on the sidelines, should have the power to reward and incentivize the content they love.
            </p>
          </section>

          <section className="md:grid grid-cols-2 gap-4 md:-ml-40 md:-mr-40 mb-10">
            <div className="col-span-1 p-4 border border-gray-300 rounded-sm shadow-xl bg-white mb-10 md:mb-0">
              <div className="font-bold text-3xl xl:text-4xl font-serif">
                Our Vision for Readers
              </div>

              <p className="mb-4">
                We’re taking the power away from the advertisers and publications and giving it to the readers.
              </p>

              <p className="mb-4">
                Readers get to reward the content they love so that they get more of it.
              </p>

              <p className="mb-4">
                They determine which content is valuable, not curators. Curation always comes with a bias.
              </p>

              <p className="mb-4">
                And readers can interact with the writers they love so they can be active players in what gets created.
              </p>
            </div>

            <div className="col-span-1 p-4 border border-gray-300 rounded-sm shadow-xl bg-white mb-10 md:mb-0">
              <div className="font-bold text-3xl xl:text-4xl font-serif">
                Our Vision for Writers
              </div>

              <p className="mb-4">
                Writers should be incentivized to provide the most value they can, rather than to play with silly marketing tactics.
              </p>

              <p className="mb-4">
                Writers should be able to focus on their writing, rather than having to create websites, products, or services they aren&apos;t passionate about simply because they need to make a living.
              </p>

              <p className="mb-4">
                Writers with small, but passionate audiences, should be able to thrive. Niche writers matter just as much as their popular counterparts.
              </p>

              <p className="mb-4">
                Writing is an end in itself. Quality writing should be rewarded in proportion to the value generated.
              </p>
            </div>
          </section>

          <section className="p-4 border border-gray-300 rounded-sm shadow-xl bg-white mb-10 z-50">
            <div className="font-bold text-3xl xl:text-4xl font-serif">
              How Bard Works
            </div>

            <p className="mb-4">
              Anyone can write on Bard. Authors choose which content is accessible and which to put behind a paywall. The choice is theirs. Readers show their support for writers in one-time donations or in monthly subscriptions.
            </p>

            <p className="mb-4">
              &quot;A society that has no respect, no regard for its bards, its historians, its storytellers, is a society in steep decline, a society that has lost its very soul and may never find its way.&quot;
            </p>

            <p className="mb-4">
              So let’s rally behind the writers that are bringing us value. Because bards, historians, and storytellers matter.
            </p>
          </section>
        </div>
      </SectionContainer>


      <div className="text-center my-10 mb-20 md:mb-10">
        <Link href="/signup">
          <a
            className="bg-primary hover:shadow-xl hover:bg-secondary text-white text-3xl button transition duration-150 ease-in-out px-5 py-3 rounded-sm"
            onClick={(): void => window.analytics.track('ABOUT: Bottom Start writing clicked')}
          >
            Start writing
          </a>
        </Link>
      </div>

      <BottomSvg className="-mt-40 hidden md:block" />

      <Footer />
    </>
  );
}

export default withApollo()(withLayout(About));
