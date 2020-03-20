import { NextPage } from 'next';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import EditorContainer from '../components/EditorContainer';

const Write: NextPage = (): React.ReactElement => {
  return (
    <EditorContainer />
  );
}

export default withApollo()(withLayout(Write));
