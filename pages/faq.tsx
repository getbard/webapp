import { NextPage } from 'next';

import { withApollo } from '../lib/apollo';

import withLayout from '../components/withLayout';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';

const FAQ: NextPage = (): React.ReactElement => {
  return (
    <>
      <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
        <PageHeader>
          Frequently Asked Questions
        </PageHeader>

        <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm mb-4">
          <h2 className="mb-2 font-bold">
            How does Bard work?
          </h2>

          <p>
            Bard is a writing platform where readers have the power to support the writers they love. Anyone can write on Bard and build a supporting audience. Readers can donate when they find content they love to support writers. We&apos;ve removed the influence of ads, bias of curation, and temptation to clickbait.
          </p>
        </div>

        <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm mb-4">
          <h2 className="mb-2 font-bold">
            Do I have to pay to use Bard?
          </h2>

          <p>
            No, Bard is free-to-use for readers and writers. However, when you find content you truly love, show your support for that writer with a one-time donation or monthly subscription!
          </p>
        </div>

        <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm mb-4">
          <h2 className="mb-2 font-bold">
            How do I earn money on Bard?
          </h2>

          <p>
            Writers can earn money on Bard by <a className="underline" href="https://stripe.com" target="_blank" rel="noopener noreferrer">setting up a Stripe account</a>. Once Stripe is connected to your Bard account, you&apos;ll able to accept monthly subscriptions and one-time donations. Time to start writing and sharing your work.
          </p>
        </div>

        <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm mb-4">
          <h2 className="mb-2 font-bold">
            How does supporter-only content work?
          </h2>

          <p>
            This is fully up to the writers&apos; discretion. A writer can make all their content available, or designate some of their content as subscriber-only. This content can be accessed with a monthly subscription to that specific writer.
          </p>
        </div>

        <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm mb-4">
          <h2 className="mb-2 font-bold">
            How does Bard make money?
          </h2>

          <p>
            We take a 10% commission on donations to keep the lights on and to improve Bard.
          </p>
        </div>
        
        <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm mb-4">
          <h2 className="mb-2 font-bold">
            I need help with something on Bard.
          </h2>

          <p>
            Talk to us! Contact us at <a className="underline" href="mailto:hello@getbard.com">hello@getbard.com</a> and we&apos;ll get back to you right away.
          </p>
        </div>
        
        <div className="w-full border border-gray-300 rounded-sm p-4 shadow-sm">
          <h2 className="mb-2 font-bold">
            I have an idea for a feature or found something I didn’t like.
          </h2>

          <p>
            Awesome. Submit it to&nbsp;
            <a
              className="underline"
              href="https://feedback.getbard.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(): void => window.analytics.track('MENU: Feedback clicked')}
            >
              our feature/bug tracking platform
            </a>
            &nbsp;or email us directly at <a className="underline" href="mailto:hello@getbard.com">hello@getbard.com</a>.
          </p>
        </div>    

      </div>

      <Footer />  
    </>
  );
}

export default withApollo()(withLayout(FAQ));
