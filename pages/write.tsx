import { useState } from 'react';
import { NextPage } from 'next';
import TextareaAutosize from 'react-textarea-autosize';

import { withApollo } from '../lib/apollo';
import withLayout from '../components/withLayout';
import Editor from '../components/Editor';

import { CreateArticleInput } from '../generated/graphql';

const Write: NextPage = (): React.ReactElement => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTitle(e.target.value);
  }

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setSummary(e.target.value);
  }

  return (
    <div className="sm:w-3/5 px-5 pt-5 container mx-auto">
      <TextareaAutosize 
        className="focus:outline-none text-4xl w-full h-auto resize-none placeholder-gray-400"
        placeholder="Title"
        onChange={handleTitleChange}
      >
      </TextareaAutosize>

      <TextareaAutosize 
        className="focus:outline-none text-xl w-full h-auto resize-none placeholder-gray-400 mb-4"
        placeholder="Add an optional summary"
        onChange={handleSummaryChange}
      >
      </TextareaAutosize>

      <Editor />
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Write));
