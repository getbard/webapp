import { useState, useEffect } from 'react';
import { Node } from 'slate';
import { useMutation } from '@apollo/react-hooks';
import TextareaAutosize from 'react-textarea-autosize';
import debounce from 'lodash/debounce';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import Editor from '../components/Editor';
import EditorNotification from '../components/EditorNotification';
import Button from '../components/Button';
import SubscribersOnlyToggle from '../components/SubcribersOnlyToggle';

import { CreateOrUpdateArticleInput, Article } from '../generated/graphql';
import CreateOrUpdateArticleMutation from '../queries/CreateOrUpdateArticleMutation';
import PublishArticleMutation from '../queries/PublishArticleMutation';
import ArticlesSummaryQuery from '../queries/ArticlesSummaryQuery';

const saveArticle = debounce(({
  createOrUpdateArticle,
  input,
  userId,
}): void => {
  createOrUpdateArticle({
    variables: {
      input,
    },
    refetchQueries: [{
      query: ArticlesSummaryQuery,
      variables: { userId },
    }],
  });
}, 2000);

const emptyDocumentString = '[{"type":"paragraph","children":[{"text":""}]}]';

function EditorContainer({ article }: { article?: Article }): React.ReactElement {
  const auth = useAuth();
  const userId = auth.userId || auth.user?.uid;
  const router = useRouter();
  const [title, setTitle] = useState(article?.title || '');
  const [summary, setSummary] = useState(article?.summary || '');
  const [content, setContent] = useState(article?.content || emptyDocumentString);
  const [subscribersOnly, setSubscribersOnly] = useState(article?.subscribersOnly || false);

  const [createOrUpdateArticle, {
    data: saveData,
    loading: mutationLoading,
    error: mutationError,
    called,
  }] = useMutation(CreateOrUpdateArticleMutation);

  const [publishArticle, {
    data: publishData,
    loading: publishLoading,
    error: publishError,
    called: publishCalled,
  }] = useMutation(PublishArticleMutation);


  const articleId = saveData?.createOrUpdateArticle?.id || article?.id;
  const publishable = !(!articleId || !title || content === emptyDocumentString);

  useEffect(() => {
    if (!title && !summary && !content || article?.draft === false) {
      return;
    }

    const input: CreateOrUpdateArticleInput = {
      title,
      summary,
      content,
      subscribersOnly,
    };

    if (articleId) {
      input.id = articleId;
    }

    saveArticle({
      createOrUpdateArticle,
      input,
      userId,
    });
  }, [title, summary, content, subscribersOnly]);

  const handleContentChange = (newContent: Node[]): void => {
    const contentString = JSON.stringify(newContent);
    setContent(contentString);
  }

  if (publishData) {
    const articleSlug = publishData?.publishArticle?.slug;
    const articleHref = articleSlug ? `/articles/s/${articleSlug}` : `/articles/i/${articleId}`;
    router.push(articleHref);
  }

  const handlePublishArticle = (): void => {
    if (!publishable) {
      return;
    }

    publishArticle({
      variables: { input: { id: articleId } },
      refetchQueries: [{
        query: ArticlesSummaryQuery,
        variables: { userId },
      }],
    });
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

          <Button
            thin
            onClick={handlePublishArticle}
            disabled={!publishable}
            className="focus:outline-none"
          >
            {
              publishLoading || (publishCalled && !publishError)
                ? <FaSpinner className="icon-spin w-full px-4 my-1" />
                : 'Publish'
            }
          </Button>
        </div>
      </div>

      <TextareaAutosize 
        className="focus:outline-none text-4xl font-serif w-full h-auto resize-none placeholder-gray-400"
        placeholder="Title"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setTitle(e.target.value)}
      >
      </TextareaAutosize>

      <TextareaAutosize 
        className="focus:outline-none text-xl w-full h-auto resize-none placeholder-gray-400 mb-4"
        placeholder="Add an optional summary"
        value={summary}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setSummary(e.target.value)}
      >
      </TextareaAutosize>

      <Editor initialValue={JSON.parse(content)} setContent={handleContentChange} />

      <EditorNotification saving={mutationLoading} error={mutationError || publishError} called={called} />
    </div>
  );
}

export default EditorContainer;
