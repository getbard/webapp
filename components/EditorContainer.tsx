import { useState, useEffect } from 'react';
import { Node } from 'slate';
import { useMutation } from '@apollo/react-hooks';
import TextareaAutosize from 'react-textarea-autosize';
import debounce from 'lodash/debounce';
import { FiLoader } from 'react-icons/fi';
import { useRouter } from 'next/router';

import { useAuth } from '../hooks/useAuth';

import Editor from './Editor';
import Button from './Button';
import SubscribersOnlyToggle from './SubcribersOnlyToggle';
import EditorHeaderPhotoSelector from './EditorHeaderPhotoSelector';
import EditorCategorySelector from './EditorCategorySelector';
import HeaderImage from './HeaderImage';
import Notification from './Notification';
import VerifyEmailAlert from './VerifyEmailAlert';

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
      variables: {
        userId,
        drafts: true,
      },
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
  const [wordCount, setWordCount] = useState(article?.wordCount || 0);
  const [subscribersOnly, setSubscribersOnly] = useState(article?.subscribersOnly || false);
  const [headerImage, setHeaderImage] = useState(article?.headerImage || null);
  const [category, setCategory] = useState(article?.category || null);
  const [notification, setNotification] = useState('');
  const noContent = !title && !summary && content === emptyDocumentString;

  const [createOrUpdateArticle, {
    data: saveData,
    loading: mutationLoading,
    error: mutationError,
    called,
  }] = useMutation(CreateOrUpdateArticleMutation);

  if (mutationLoading && notification !== 'Saving...') {
    setNotification('Saving...');
  } else if (!mutationLoading && notification === 'Saving...') {
    setTimeout(() => setNotification('Saved!'), 500);
  }

  const [publishArticle, {
    data: publishData,
    loading: publishLoading,
    error: publishError,
    called: publishCalled,
  }] = useMutation(PublishArticleMutation);

  const articleId = saveData?.createOrUpdateArticle?.id || article?.id;

  // An article is publishable when...
  // it has been saved with a title and content
  // and no mutations are currently happening
  // and the user has been verified
  const publishable = !(!articleId || !title || content === emptyDocumentString)
    && !(called && mutationLoading)
    && auth?.user?.emailVerified;

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
      headerImage,
      wordCount,
      category,
    };

    if (articleId) {
      input.id = articleId;
    }

    saveArticle({
      createOrUpdateArticle,
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
    if (!publishable) {
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
    <div className="relative py-5">
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

      <div className="editor-container sm:w-3/5 px-5 container mx-auto">
        {
          headerImage?.url
          && <HeaderImage className="w-auto -mx-5 sm:-mx-40 mb-4" url={headerImage?.url} />
        }

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
          showNotification={mutationLoading}
          error={mutationError || publishError}
          bgColor="bg-primary"
        >
          {notification}
        </Notification>
      </div>
    </div>
  );
}

export default EditorContainer;
