import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import { Collection } from '../../generated/graphql';
import UserCollectionsQuery from '../../queries/UserCollectionsQuery';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import PageHeader from '../../components/PageHeader';
import CollectionRow from '../../components/CollectionRow';

const Collections: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const { username } = router.query;
  const { data, loading, error, refetch } = useQuery(UserCollectionsQuery, {
    variables: { username },
  });

  const prettyName = data?.user?.firstName ? `${data.user.firstName}'s` : `${username}'s`;
  const collections = data?.user?.collections || [];
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
        <PageHeader>
          <Link href={`/${username}`}>
            <a>
              {prettyName}
            </a>
          </Link>

          &nsbp;Collections
        </PageHeader>

        <div>
          {collections.map((collection: Collection) => (
            <CollectionRow
              key={collection.id}
              collection={collection}
              refetch={refetch}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default withApollo()(withLayout(Collections));
