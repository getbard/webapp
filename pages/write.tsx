import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import EditorContainer from '../components/EditorContainer';

const Write: NextPage = (): React.ReactElement => {
  return (
    <>
      <NextSeo
        title="Write"
        description="Write your next masterpiece."
      />

      <EditorContainer />
    </>
  );
}

export default withApollo()(withLayout(Write));
