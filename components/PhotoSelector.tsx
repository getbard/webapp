import { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';
import debounce from 'lodash/debounce';

import { ArticleHeaderImage } from '../generated/graphql';

import { UnsplashPhoto } from '../generated/graphql';
import UnsplashPhotoQuery from '../queries/UnsplashPhotoQuery';

type ImageThumbnailProps = {
  url: string;
}

const ThumbnailContainer = styled.div`
  &:hover {
    > div {
      opacity: 0.75;
    }
  }
`;

const ImageThumbnail = styled.div`
  background-size: cover;
  background-position: center;
  background-image: url(${(props: ImageThumbnailProps): string => props.url});
`;

const EmptyPhotoResults = styled.div`
  min-width: 28rem;

  @media (max-width: 640px) {
    min-width: calc(100vw - 4rem);
  }
`;

const UnsplashThumbnail = ({
  photo,
  onClick,
}: {
  photo: UnsplashPhoto;
  onClick: (headerImage: ArticleHeaderImage | null) => void;
}): React.ReactElement => {
  return (
    <ThumbnailContainer
      className="col-span-1 hover:cursor-pointer"
      onClick={(): void => onClick({
        id: photo.id,
        url: photo.urls.full,
        downloadUrl: photo.urls.download_location,
        photographerName: photo.photographerName,
        photographerUrl: photo.photographerUrl,
      })}
    >
      <ImageThumbnail className="h-24 w-40" url={photo.urls.thumb} />

      <div className="text-xs w-40">by {photo.photographerName}</div>
    </ThumbnailContainer>
  );
}

export function PhotoSelector({
  onSelect,
}: {
  onSelect: (headerImage: ArticleHeaderImage | string | null) => void;
}): React.ReactElement {
  const [search, setSearch] = useState('');
  const { loading, error, data } = useQuery(UnsplashPhotoQuery, { variables: { search } });

  const debouncedSetSearch = debounce(setSearch, 1000);

  const handlePhotoSelect = (headerImage: ArticleHeaderImage | null): void => {
    window.analytics.track('PHOTO SELECTOR: Photo selected');

    if (headerImage?.__typename) {
      delete headerImage.__typename;
    }

    onSelect(headerImage);
  }

  if (loading && !data) return <></>;
  if (error) return <></>;

  const { unsplashPhoto } = data;

  return (
    <>
      <input
        className="w-full mb-2 border border-gray-300 rounded-sm py-2 px-3 focus:outline-none focus:border-primary"
        placeholder="Don&apos;t like what you see? Try searching to narrow your results."
        onChange={(e): void => debouncedSetSearch(e.target.value)}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {
          !unsplashPhoto.length && (
            <EmptyPhotoResults className="col-span-2 md:col-span-5 flex flex-col justify-center items-center py-10">
              <div className="text-center">
                We couldn&apos;t find any photos.
              </div>

              <div className="text-center">
                Change your search and try again.
              </div>
            </EmptyPhotoResults>
          )
        }

        {
          unsplashPhoto.length > 0 &&
            unsplashPhoto.map((photo: UnsplashPhoto): React.ReactElement => {
              return <UnsplashThumbnail key={photo.id} photo={photo} onClick={handlePhotoSelect} />;
            }
          )
        }
      </div>
    </>
  );
}

export default PhotoSelector;
