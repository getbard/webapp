import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import ProfileSectionContainer from '../../components/ProfileSectionContainer';

const ProfileSection: NextPage = (): React.ReactElement => {
  return (
    <>
      <NextSeo
        title="Profile Section"
        description="Create a section for your profile."
      />

      <ProfileSectionContainer />
    </>
  );
}

export default withApollo()(withLayout(ProfileSection));
