import { useState } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import PageHeader from '../components/PageHeader';
import SettingsMenu from '../components/SettingsMenu';
import Subscriptions from '../components/SubscriptionSettings';
import VerifyEmailAlert from '../components/VerifyEmailAlert';
import AccountSettings from '../components/AccountSettings';
import SettingsFooter from '../components/SettingsFooter';

const settingsComponents: { [key: string]: any } = {
  account: AccountSettings,
  subscriptions: Subscriptions,
};

const Settings: NextPage = (): React.ReactElement => {
  const [settingsOption, setSettingsOption] = useState('account');
  const Component = settingsComponents[settingsOption];

  return (
    <div className="py-5">
      <NextSeo
        title="Settings"
        description="Change your settings on Bard."
      />

      <VerifyEmailAlert />

      <div className="sm:w-3/5 px-5 container mx-auto relative">
        <PageHeader>
          Settings
        </PageHeader>

        <div className="grid grid-cols-1 sm:grid-cols-8">
          <SettingsMenu
            settingsOptions={Object.keys(settingsComponents)}
            settingsOption={settingsOption}
            setSettingsOption={setSettingsOption}
          />

          <div className="col-span-6">
            <Component />
          </div>

          <div className="sm:hidden mt-4">
            <SettingsFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withApollo()(withLayout(Settings));
