import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import TextareaAutosize from 'react-textarea-autosize';
import { FiX } from 'react-icons/fi';

import { useAuth } from '../../hooks/useAuth';

import { Article } from '../../generated/graphql';
import CollectionQuery from '../../queries/CollectionQuery';
import UpdateCollectionMutation from '../../queries/UpdateCollectionMutation';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import ArticleCard from '../../components/ArticleCard';
import Button from '../../components/Button';
import Notification from '../../components/Notification';
import CollectionFallback from '../../components/CollectionFallback';
import GenericError from '../../components/GenericError';
import PublicCollectionToggle from '../../components/PublicCollectionToggle';

const Collections: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const auth = useAuth();
  const { id } = router.query;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [articles, setArticles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const { data, loading, error, refetch } = useQuery(CollectionQuery, {
    variables: { id },
  });

  const [updateCollection, { error: updateError }] = useMutation(UpdateCollectionMutation, {
    update() {
      refetch();
    },
  });

  if (loading) return <CollectionFallback />;
  if (error) return <div><GenericError title error={error} /></div>;

  const trackingData = {
    collection: data?.collection.id,
    name: data?.collection.name,
    description: data?.collection.description,
    public: data?.collection.public,
    authorId: data?.collection.userId,
  }

  if (data?.collection.name && !name) {
    setName(data?.collection.name);
  }

  if (data?.collection.description && !description) {
    setDescription(data?.collection.description);
  }

  if (data?.collection.articles.length && !articles.length) {
    setArticles(data?.collection.articles);
  }

  const collectionOwner = auth.userId === data?.collection.userId;
  const displayName = collectionOwner
    ? 'you'
    : `${data?.collection?.user?.firstName}${data?.collection?.user?.lastName && ' ' + data?.collection?.user?.lastName[0] + '.'}`;

  const seoDescription = `A collection of articles curated by ${displayName}.`;

  const handleSaveCollection = (): void => {
    window.analytics.track('COLLECTION: Save clicked', trackingData);

    updateCollection({
      variables: {
        input: {
          id: data.collection.id,
          name,
          description,
        }
      }
    });

    setIsEditing(false);
  }

  const handleRemoveArticle = (articleId: string): void => {
    window.analytics.track('COLLECTION: Remove article clicked', trackingData);
    const deleteConfirmed = confirm('Are you sure you want to remove this article from this collection?');

    if (deleteConfirmed) {
      window.analytics.track('COLLECTION: Remove article confirmed', trackingData);
      
      const articleIds = data.collection.articleIds
        .filter((currArticleId: string) => currArticleId !== articleId);

      const newArticles = articles.filter((article: Article) => article.id !== articleId);

      updateCollection({
        variables: {
          input: {
            id: data.collection.id,
            articleIds,
          }
        }
      });

      setArticles(newArticles);
    }
  }

  const handlePublicToggle = (isPublic: boolean): void  => {
    updateCollection({
      variables: {
        input: {
          id: data.collection.id,
          public: isPublic,
        }
      }
    });
  }

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
        <div className="mb-6">
          {
            collectionOwner && (
              <PublicCollectionToggle
                isPrivate={!data?.collection?.public}
                onClick={handlePublicToggle}
              />
            )
          }
          
          <div className="flex justify-between items-center">
            <TextareaAutosize 
              className="focus:outline-none text-4xl font-serif w-full h-auto resize-none placeholder-gray-500 font-bold"
              placeholder="Name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setName(e.target.value)}
              maxLength={80}
              readOnly={!isEditing}
            >
            </TextareaAutosize>

            {
              collectionOwner && !isEditing && (
                <Button
                  onClick={(): void => {
                    window.analytics.track('COLLECTION: Edit clicked', trackingData);
                    setIsEditing(true);
                  }}
                  thin
                >
                  Edit
                </Button>
              )
            }

            {
              collectionOwner && isEditing && (
                <Button onClick={handleSaveCollection} thin>
                  Save
                </Button>
              )
            }
          </div>

          <TextareaAutosize 
            className="focus:outline-none text-xl w-full h-auto resize-none placeholder-gray-500 font-serif"
            placeholder={isEditing ? 'Add a description' : ''}
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setDescription(e.target.value)}
            maxLength={200}
            readOnly={!isEditing}
          >
          </TextareaAutosize>

          <div>
            {
              articles.length
               ? (
                <span>
                  {articles.length} article{articles.length === 1 ? '' : 's'} collected by&nbsp;
                </span>
               )
               : (
                 <span>Empty collection by&nbsp;</span>
               )
            }

            <Link href={`/${data?.collection?.user?.username}`}>
              <a
                className="underline"
                onClick={(): void => window.analytics.track('COLLECTION: Username clicked', trackingData)}
              >
                {displayName}
              </a>
            </Link>
          </div>
        </div>

        {
          articles.length
          ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {articles.map((article: Article) => (
                  <div key={article.id} className="col-span-1 relative flex">
                    {isEditing && (
                      <FiX
                        className="absolute top-0 right-0 text-4xl text-red-600 bg-white rounded-bl-sm border-t border-r border-gray-300 p-1 z-10 hover:bg-gray-100 hover:cursor-pointer hover:text-red-800"
                        onClick={(): void => handleRemoveArticle(article.id)}
                      />
                    )}
    
                    <ArticleCard article={article} />
                  </div>
                ))}
            </div>
          )
          : (
            <div className="flex justify-center items-center text-3xl p-20">
              There are no articles in this collection.
            </div>
          )
        }
      </div>

      <Notification
        showNotification={false}
        error={error || updateError}
      />
    </>
  );
}

export default withApollo()(withLayout(Collections));
