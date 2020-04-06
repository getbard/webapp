import { useState } from 'react';
import { NextPage } from 'next';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import PageHeader from '../components/PageHeader';
import SettingsMenu from '../components/SettingsMenu';
import Subscriptions from '../components/Subscriptions';

const settingsComponents: { [key: string]: any } = {
  subscriptions: Subscriptions,
};

const Settings: NextPage = (): React.ReactElement => {
  const [settingsOption, setSettingsOption] = useState('subscriptions');
  const Component = settingsComponents[settingsOption];

  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      <PageHeader>
        Settings
      </PageHeader>

      <div className="flex">
        <SettingsMenu
          settingsOption={settingsOption}
          setSettingsOption={setSettingsOption}
        />

        <Component />
      </div>
    </div>
  );
}

export default withApollo()(withLayout(Settings));
