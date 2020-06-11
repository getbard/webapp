import { useState, useEffect } from 'react';
import { Node } from 'slate';
import { useMutation } from '@apollo/react-hooks';
import TextareaAutosize from 'react-textarea-autosize';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import Editor from './Editor';
import Button from './Button';
import SubscribersOnlyToggle from './SubcribersOnlyToggle';
import EditorHeaderPhotoSelector from './EditorHeaderPhotoSelector';
import EditorCategorySelector from './EditorCategorySelector';
import Notification from './Notification';
import VerifyEmailAlert from './VerifyEmailAlert';

import { CreateOrUpdateArticleInput, Article, PublishArticleInput } from '../generated/graphql';
import CreateArticleMutation from '../queries/CreateArticleMutation';
import UpdateArticleMutation from '../queries/UpdateArticleMutation';
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
      variables: {
        userId,
        drafts: true,
      },
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
  const [wordCount, setWordCount] = useState(article?.wordCount || 0);
  const [subscribersOnly, setSubscribersOnly] = useState(article?.subscribersOnly || false);
  const [headerImage, setHeaderImage] = useState(article?.headerImage || null);
  const [category, setCategory] = useState(article?.category || null);
  const [notification, setNotification] = useState('');
  const [articleId, setArticleId] = useState(article?.id || null);
  const [publishable, setPublishable] = useState(false);

  const [createArticle, {
    data: createData,
    loading: createLoading,
    error: createError,
    called: createCalled,
  }] = useMutation(CreateArticleMutation);

  const [updateArticle, {
    loading: updateLoading,
    error: updateError,
    called: updateCalled,
  }] = useMutation(UpdateArticleMutation);

  if ((createLoading || updateLoading) && notification !== 'Saving...') {
    setNotification('Saving...');
  } else if (!(createLoading || updateLoading) && notification === 'Saving...') {
    setTimeout(() => setNotification('Saved!'), 500);
  }

  useEffect(() => {
    // When you have created or updated an article
    // store the ID; but not if an article was already published
    if (!articleId && !article?.publishedAt && createData?.createArticle?.id) {
      // Clear the debounced calls from before having an ID
      saveArticle.cancel();

      setArticleId(createData?.createArticle?.id);
    }
  }, [createData?.createArticle?.id]);

  const [publishArticle, {
    data: publishData,
    loading: publishLoading,
    error: publishError,
    called: publishCalled,
  }] = useMutation(PublishArticleMutation);

  // An article is publishable when...
  // it has been saved with a title and content
  // and no mutations are currently happening
  // and the user has been verified
  useEffect(() => {
    const articleIsEmpty = (!articleId || !title || content === emptyDocumentString);
    const mutationCalledAndLoading = (createCalled && createLoading) || (updateCalled && updateLoading);
    const userEmailVerified = !!auth?.user?.emailVerified;
    setPublishable(!articleIsEmpty && !mutationCalledAndLoading && userEmailVerified);
  }, [
    articleId,
    title,
    content,
    createCalled,
    createLoading,
    updateCalled,
    updateLoading,
    auth?.user?.emailVerified
  ]);

  const publishButtonText = article?.publishedAt ? 'Save and Publish' : 'Publish';

  useEffect(() => {
    const noContent = !title && !summary && content === emptyDocumentString;
    if (noContent || article?.publishedAt) {
      return;
    }

    if (headerImage?.__typename) {
      delete headerImage.__typename;
    }

    const input: CreateOrUpdateArticleInput = {
      id: articleId,
      title,
      summary,
      content,
      subscribersOnly,
      headerImage,
      wordCount,
      category,
    };

    const mutation = articleId ? updateArticle : createArticle;

    saveArticle({
      createOrUpdateArticle: mutation,
      input,
      userId,
    });
  }, [title, summary, content, subscribersOnly, headerImage?.url, category]);

  const handleContentChange = (newContent: Node[]): void => {
    const contentString = JSON.stringify(newContent);
    setContent(contentString);
    // Serialize the Slate content and then count the words
    setWordCount(newContent.flatMap(n => Node.string(n).split(' ')).length);
  }

  if (publishData) {
    const articleSlug = publishData?.publishArticle?.slug;
    const articleHref = articleSlug ? `/articles/s/${articleSlug}` : `/articles/i/${articleId}`;
    router.push(articleHref);
  }

  const handlePublishArticle = (): void => {
    if (!publishable || !articleId) {
      return;
    }

    let input: PublishArticleInput;
    if (article?.publishedAt) {
      if (headerImage?.__typename) {
        delete headerImage.__typename;
      }

      input = {
        id: articleId,
        article: {
          title,
          summary,
          content,
          subscribersOnly,
          headerImage,
          category,
          wordCount,
        }
      };
    } else {
      input = { id: articleId };
    }

    publishArticle({
      variables: { input },
      refetchQueries: [{
        query: ArticlesSummaryQuery,
        variables: {
          userId,
          drafts: true,
        },
      }],
    });
  }

  return (
    <div className="relative pt-5 pb-10">
      <VerifyEmailAlert />

      <div className={`${auth?.user?.emailVerified && 'sticky'} bg-white z-20 top-0 min-w-screen py-2 mb-4`}>
        <div className="flex justify-between sm:w-3/5 px-5 container mx-auto">
          <SubscribersOnlyToggle
            subscribersOnly={subscribersOnly}
            setSubscribersOnly={setSubscribersOnly}
          />

          <div>
            <Button
              thin
              onClick={handlePublishArticle}
              disabled={!publishable}
              className="focus:outline-none"
              loading={publishLoading || (publishCalled && !publishError)}
            >
              {publishButtonText}
            </Button>
          </div>
        </div>
      </div>

      {
        headerImage?.url
        && <img src={headerImage?.url} className="max-h-screen mb-4 mx-auto" />
      }

      <div className="editor-container sm:w-3/5 px-5 container mx-auto">
        <div className="w-full">
          <EditorHeaderPhotoSelector
            headerImage={headerImage}
            setHeaderImage={setHeaderImage}
          />
          
          <EditorCategorySelector
            category={category}
            setCategory={setCategory}
          />
        </div>

        <TextareaAutosize 
          className="focus:outline-none text-4xl font-serif w-full h-auto resize-none placeholder-gray-500 font-bold"
          placeholder="Title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setTitle(e.target.value)}
          maxLength={80}
        >
        </TextareaAutosize>

        <TextareaAutosize 
          className="focus:outline-none text-xl w-full h-auto resize-none placeholder-gray-500 mb-6 font-serif"
          placeholder="Add a summary"
          value={summary}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setSummary(e.target.value)}
          maxLength={200}
        >
        </TextareaAutosize>

        <Editor initialValue={JSON.parse(content)} setContent={handleContentChange} />

        <Notification
          showNotification={createLoading || updateLoading}
          error={createError || updateError || publishError}
          bgColor="bg-primary"
        >
          {notification}
        </Notification>
      </div>
    </div>
  );
}

export default EditorContainer;
