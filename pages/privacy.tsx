import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import { withApollo } from '../lib/apollo';

import withLayout from '../components/withLayout';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';

const Privacy: NextPage = (): React.ReactElement => {
  return (
    <>
      <NextSeo
        title="Privacy"
        description="This privacy policy describes how your personal information is collected, used, and shared on Bard."
      />

      <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
        <section className="mb-4">
          <PageHeader>
            Privacy Policy
          </PageHeader>

          <p className="mb-4">This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from https://getbard.com (the “Site”).</p>

          <h2 className="text-2xl font-serif font-bold mb-4 mt-10">Personal Information We Collect</h2>

          <p className="mb-4">When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information.”</p>

          <p className="mb-4">We collect Device Information using the following technologies:</p>

          <p className="mb-4">- “Cookies” are data files that are placed on your device or computer and often include an anonymous unique identifier. For more information about cookies, and how to disable cookies, visit http://www.allaboutcookies.org.</p>
          <p className="mb-4">- “Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.</p>
          <p className="mb-4">- “Web beacons,” “tags,” and “pixels” are electronic files used to record information about how you browse the Site.</p>

          <p className="mb-4">Additionally when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers, email address, and phone number.  We refer to this information as “Order Information.”</p>

          <p className="mb-4">When we talk about “Personal Information” in this Privacy Policy, we are talking both about Device Information and Order Information.</p>

          <h2 className="text-2xl font-serif font-bold mb-4 mt-10">How Do We Use Your Personal Information?</h2>

          <p className="mb-4">We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).  Additionally, we use this Order Information to:</p>
          <p className="mb-4">Communicate with you;</p>
          <p className="mb-4">Screen our orders for potential risk or fraud; and</p>
          <p className="mb-4">When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</p>
          <p className="mb-4">We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).</p>

          <h2 className="text-2xl font-serif font-bold mb-4 mt-10">Sharing Your Personal Information</h2>

          <p className="mb-4">We share your Personal Information with third parties to help us use your Personal Information, as described above.  We use Google Analytics to help us understand how our customers use the Site--you can read more about how Google uses your Personal Information here: <a href="https://www.google.com/intl/en/policies/privacy/"> https://www.google.com/intl/en/policies/privacy/</a>.  You can also opt-out of Google Analytics here: <a href="https://tools.google.com/dlpage/gaoptout">https://tools.google.com/dlpage/gaoptout</a>.</p>

          <p className="mb-4">Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.</p>

          <h2 className="text-2xl font-serif font-bold mb-4 mt-10">Behavioural Advertising</h2>

          <p className="mb-4">As described above, we use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you.  For more information about how targeted advertising works, you can visit the Network Advertising Initiative’s (“NAI”) educational page at <a href="http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work">http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work</a>.</p>

          <p className="mb-4">You can opt out of targeted advertising by:</p>
          <p className="mb-4">FACEBOOK - <a href="https://www.facebook.com/settings/?tab=ads">https://www.facebook.com/settings/?tab=ads</a></p>
          <p className="mb-4">GOOGLE - <a href="https://www.google.com/settings/ads/anonymous">https://www.google.com/settings/ads/anonymous</a></p>
          <p className="mb-4">BING - <a href="https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads">https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads</a></p>

          <p className="mb-4">Additionally, you can opt out of some of these services by visiting the Digital Advertising Alliance’s opt-out portal at: <a href="http://optout.aboutads.info/">http://optout.aboutads.info/</a>.</p>

          <h2 className="text-2xl font-serif font-bold mb-4 mt-10">Do Not Track</h2>

          <p className="mb-4">Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track signal from your browser.</p>

          <h2 className="text-2xl font-serif font-bold mb-4 mt-10">Your Rights</h2>

          <p className="mb-4">If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.</p>

          <p className="mb-4">Additionally, if you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above.  Additionally, please note that your information will be transferred outside of Europe, including to Canada and the United States.</p>

          <h2 className="text-2xl font-serif font-bold mb-4 mt-10">Data Retention</h2>

          <p className="mb-4">When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.</p>

          <h2 className="text-2xl font-serif font-bold mb-4 mt-10">Changes</h2>

          <p className="mb-4">We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.</p>

          <h2 className="text-2xl font-serif font-bold mb-4 mt-10">Contact Us</h2>

          <p className="mb-4">For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:hello@getbard.com">hello@getbard.com</a> or by mail using the details provided below:</p>

          <p className="mb-4">1809 1820 Willingdon Ave, Burnaby, BC, BC, V5C 0K5, Canada</p>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default withApollo()(withLayout(Privacy));
