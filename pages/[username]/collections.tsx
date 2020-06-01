import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import { useAuth } from '../../hooks/useAuth';

import UsernameQuery from '../../queries/UsernameQuery';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import PageHeader from '../../components/PageHeader';
import CollectionContainer from '../../components/CollectionContainer';
import ButtonLink from '../../components/ButtonLink';

const Collections: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const auth = useAuth();
  const { username } = router.query;
  const { data } = useQuery(UsernameQuery, {
    variables: { username },
  });
  
  const collectionOwner = auth.userId === data?.user?.id;
  const prettyName = data?.user?.firstName ? `${data.user.firstName}'s` : `${username}'s`;
  const seoTitle = `${prettyName} Collections`;
  const seoDescription = `Articles curated by ${username}.`;

  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        openGraph={{
          title: seoTitle,
          type: 'website',
          description: seoDescription,
          url: `https://getbard.com/${username}/collections`,
        }}
      />

      <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
        <div className="flex justify-between items-center">
          <PageHeader>
            <Link href={`/${username}`}>
              <a>
                {prettyName}
              </a>
            </Link>

            &nbsp;Collections
          </PageHeader>

          <div className="mb-4">
            {
              collectionOwner && (
                <ButtonLink href="/collections/create">
                  Create collection
                </ButtonLink>
              )
            }
          </div>
        </div>

        <CollectionContainer username={username as string || ''} />
      </div>
    </>
  );
}

export default withApollo()(withLayout(Collections));