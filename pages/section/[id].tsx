import { useQuery } from '@apollo/react-hooks';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import ProfileSectionQuery from '../../queries/ProfileSectionQuery';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import ProfileSectionContainer from '../../components/ProfileSectionContainer';
import GenericError from '../../components/GenericError';
import BardError from '../_error';

const ProfileSection: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const { data, error } = useQuery(ProfileSectionQuery, { variables: { id: router.query?.id } });

  if (error?.message.includes('Section not found')) {
    return <BardError statusCode={404} hasGetInitialPropsRun={true} err={null} />;
  }
  if (error) return <div><GenericError title /></div>;

  return (
    <>
      <NextSeo
        title="Profile Section"
        description="Edit a section of your profile."
      />

      <ProfileSectionContainer section={data?.profileSection || null} />
    </>
  );
}

export default withApollo()(withLayout(ProfileSection));
