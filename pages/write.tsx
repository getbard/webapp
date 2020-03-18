import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Node } from 'slate';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import TextareaAutosize from 'react-textarea-autosize';
import debounce from 'lodash/debounce';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import Editor from '../components/Editor';
import EditorNotification from '../components/EditorNotification';
import Button from '../components/Button';
import SubscribersOnlyToggle from '../components/SubcribersOnlyToggle';

import { CreateOrUpdateArticleInput } from '../generated/graphql';

const CREATE_OR_UPDATE_ARTICLE = gql`
  mutation createOrUpdateArticle($input: CreateOrUpdateArticleInput!) {
    createOrUpdateArticle(input: $input) {
      id
    }
  }
`;

const saveArticle = debounce((createOrUpdateArticle, input: CreateOrUpdateArticleInput, data): void => {
  if (data?.createOrUpdateArticle?.id) {
    input.id = data.createOrUpdateArticle.id;
  }

  createOrUpdateArticle({
    variables: {
      input,
    },
  });
}, 2000);

const Write: NextPage = (): React.ReactElement => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [subscribersOnly, setSubscribersOnly] = useState(false);
  const [createOrUpdateArticle, { data, loading: mutationLoading, error: mutationError, called }] = useMutation(CREATE_OR_UPDATE_ARTICLE);

  useEffect(() => {
    if (!title && !summary && !content) {
      return;
    }

    const input: CreateOrUpdateArticleInput = {
      title,
      summary,
      content,
      subscribersOnly,
    };

    saveArticle(createOrUpdateArticle, input, data);
  }, [title, summary, content, subscribersOnly]);

  const handleContentChange = (newContent: Node[]): void => {
    const contentString = JSON.stringify(newContent);
    setContent(contentString);
  }

  return (
    <div className="sm:w-3/5 px-5 pt-5 container mx-auto relative">
      <div className="flex justify-between sticky bg-white z-10 top-0 -mt-2 mb-4 py-2">
        <SubscribersOnlyToggle
          subscribersOnly={subscribersOnly}
          setSubscribersOnly={setSubscribersOnly}
        />

        <div>
          {/* <span className="mr-4 underline">
            Schedule
          </span> */}

          <Button thin>
            Publish
          </Button>
        </div>
      </div>

      <TextareaAutosize 
        className="focus:outline-none text-4xl w-full h-auto resize-none placeholder-gray-400"
        placeholder="Title"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setTitle(e.target.value)}
      >
      </TextareaAutosize>

      <TextareaAutosize 
        className="focus:outline-none text-xl w-full h-auto resize-none placeholder-gray-400 mb-4"
        placeholder="Add an optional summary"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setSummary(e.target.value)}
      >
      </TextareaAutosize>

      <Editor setContent={handleContentChange} />

      <EditorNotification saving={mutationLoading} error={mutationError} called={called} />
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Write));
