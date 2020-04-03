import { useState, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';
import debounce from 'lodash/debounce';

import { ArticleHeaderImage } from '../generated/graphql';

import useOnClickOutside from '../hooks/useOnClickOutside';

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
        photographerName: photo.photographerName,
        photographerUrl: photo.photographerUrl,
      })}
    >
      <ImageThumbnail className="w-full h-24" url={photo.urls.thumb} />
      <div className="text-xs">by {photo.photographerName}</div>
    </ThumbnailContainer>
  );
}

export function PhotoSelector({
  onSelect,
  display,
  setDisplay,
}: {
  onSelect: (headerImage: ArticleHeaderImage | null) => void;
  display: boolean;
  setDisplay: (display: boolean) => void;
}): React.ReactElement {
  const selectorRef = useRef(null);
  const [search, setSearch] = useState('');
  const { loading, error, data } = useQuery(UnsplashPhotoQuery, { variables: { search } });

  const debouncedSetSearch = debounce(setSearch, 1000);

  useOnClickOutside(selectorRef, () => {
    if (display) {
      setDisplay(!display);
    }
  });

  const handlePhotoSelect = (headerImage: ArticleHeaderImage | null): void => {
    onSelect(headerImage);
    setDisplay(false);
  }

  if (loading && !data) return <></>;
  if (error) return <></>;

  const { unsplashPhoto } = data;

  return (
    <div className="absolute top-0 z-10 mt-10 bg-gray-100 p-2 rounded-sm border border-gray-300" ref={selectorRef}>
      <input
        className="w-full mb-2 border border-gray-300 rounded-sm py-2 px-3 focus:outline-none focus:border-primary"
        placeholder="Don&apos;t like what you see? Try searching to narrow your results."
        onChange={(e): void => debouncedSetSearch(e.target.value)}
      />

      <div className="grid grid-cols-5 gap-2">
        {unsplashPhoto.map((photo: UnsplashPhoto): React.ReactElement => {
          return <UnsplashThumbnail key={photo.id} photo={photo} onClick={handlePhotoSelect} />;
        })}
      </div>
    </div>
  );
}

export default PhotoSelector;
