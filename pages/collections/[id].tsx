import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import { Collection } from '../../generated/graphql';
import CollectionQuery from '../../queries/CollectionQuery';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import PageHeader from '../../components/PageHeader';

const Collections: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error, refetch } = useQuery(CollectionQuery, {
    variables: { id },
  });

  const seoDescription = `A collection of articles curated by a guy.`;
console.log(data);
  return (
    <>
      <NextSeo
        title={data?.collection.name}
        description={seoDescription}
        openGraph={{
          title: data?.collection.name,
          type: 'website',
          description: seoDescription,
          url: `https://getbard.com/collections/${id}`,
        }}
      />

      <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
        <PageHeader>
          {data?.collection.name}
        </PageHeader>

        <div>
          
        </div>
      </div>
    </>
  );
}

export default withApollo()(withLayout(Collections));
