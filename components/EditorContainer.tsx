import { useState, useEffect } from 'react';
import { Node } from 'slate';
import { useMutation } from '@apollo/react-hooks';
import TextareaAutosize from 'react-textarea-autosize';
import debounce from 'lodash/debounce';
import { FiLoader } from 'react-icons/fi';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import Editor from './Editor';
import EditorNotification from './EditorNotification';
import Button from './Button';
import SubscribersOnlyToggle from './SubcribersOnlyToggle';
import EditorHeaderPhotoSelector from './EditorHeaderPhotoSelector';
import HeaderImage from './HeaderImage';

import { CreateOrUpdateArticleInput, Article, PublishArticleInput } from '../generated/graphql';
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
}, 1000);

const emptyDocumentString = '[{"type":"paragraph","children":[{"text":""}]}]';

function EditorContainer({ article }: { article?: Article }): React.ReactElement {
  const auth = useAuth();
  const userId = auth.userId || auth.user?.uid;
  const router = useRouter();
  const [title, setTitle] = useState(article?.title || '');
  const [summary, setSummary] = useState(article?.summary || '');
  const [content, setContent] = useState(article?.content || emptyDocumentString);
  const [subscribersOnly, setSubscribersOnly] = useState(article?.subscribersOnly || false);
  const [headerImageURL, setHeaderImageURL] = useState(article?.headerImageURL || '');
  const noContent = !title && !summary && content === emptyDocumentString;

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
  const publishable = !(!articleId || !title || content === emptyDocumentString) && !(called && mutationLoading);
  const publishButtonText = article?.publishedAt ? 'Save and Publish' : 'Publish';

  useEffect(() => {
    if (noContent || article?.publishedAt) {
      return;
    }

    const input: CreateOrUpdateArticleInput = {
      title,
      summary,
      content,
      subscribersOnly,
      headerImageURL,
    };

    if (articleId) {
      input.id = articleId;
    }

    saveArticle({
      createOrUpdateArticle,
      input,
      userId,
    });
  }, [title, summary, content, subscribersOnly, headerImageURL]);

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

    let input: PublishArticleInput;
    if (article?.publishedAt) {
      input = {
        id: articleId,
        article: {
          title,
          summary,
          content,
          subscribersOnly,
          headerImageURL,
        }
      };
    } else {
      input = { id: articleId };
    }

    publishArticle({
      variables: { input },
      refetchQueries: [{
        query: ArticlesSummaryQuery,
        variables: { userId },
      }],
    });
  }

  return (
    <div className="relative py-5">
      <div className="sticky bg-white z-20 top-0 min-w-screen py-2 mb-4">
        <div className="flex justify-between sm:w-3/5 px-5 container mx-auto">
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
                  ? <FiLoader className="icon-spin w-full px-4 text-xl" />
                  : publishButtonText
              }
            </Button>
          </div>
        </div>
      </div>

      <div className="sm:w-3/5 px-5 container mx-auto">
        {
          (article?.headerImageURL || headerImageURL)
          && <HeaderImage className="w-auto -mx-5 sm:-mx-40 mb-4" url={article?.headerImageURL || headerImageURL} />
        }

        <EditorHeaderPhotoSelector setHeaderImageURL={setHeaderImageURL} />

        <TextareaAutosize 
          className="focus:outline-none text-4xl font-serif w-full h-auto resize-none placeholder-gray-400"
          placeholder="Title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setTitle(e.target.value)}
        >
        </TextareaAutosize>

        <TextareaAutosize 
          className="focus:outline-none text-xl w-full h-auto resize-none placeholder-gray-400 mb-4 font-medium"
          placeholder="Add an optional summary"
          value={summary}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setSummary(e.target.value)}
        >
        </TextareaAutosize>

        <Editor initialValue={JSON.parse(content)} setContent={handleContentChange} />

        <EditorNotification saving={mutationLoading} error={mutationError || publishError} called={called} />
      </div>
    </div>
  );
}

export default EditorContainer;
