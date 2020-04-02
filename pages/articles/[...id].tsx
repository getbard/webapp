import { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { format } from 'date-fns';
import styled from '@emotion/styled';
import throttle from 'lodash/throttle';

import useOnScreen from '../../hooks/useOnScreen';

import ArticleBySlugQuery from '../../queries/ArticleBySlugQuery';
import ArticleByIdQuery from '../../queries/ArticleByIdQuery';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import Editor from '../../components/Editor';
import HeaderImage from '../../components/HeaderImage';
import Button from '../../components/Button';

const GradientBlocker = styled.div`
  width: 100%;
  background: linear-gradient(0deg, rgba(255,255,255,1) 20%, rgba(255,255,255,0) 100%);
`;

type ProgressBarProps = {
  onScreen: boolean;
}

const ProgressBar = styled.div`
  width: 0.15rem;
  height: 100vh;
  opacity: ${(props: ProgressBarProps): number => props.onScreen ? 100 : 0};
`;

type InnerProgressBarProps = {
  height: number;
}

const InnerProgressBar = styled.div`
  height: ${(props: InnerProgressBarProps): number => props.height}%;
`;

const ContentBlocker = ({ author }: { author: string }): React.ReactElement => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0">
        <GradientBlocker className="h-full w-full" />

        <div className="bg-white flex flex-col justify-center items-center pb-10 pt-0 -mt-16">
          <div className="mb-2">
            {author} has made this content available to supporters only.
          </div>

          <Button>
            Support {author} to read this article
          </Button>

          <div className="mt-2">
            Already a supporter? <Link href="/login"><a>Login to read</a></Link>
          </div>
        </div>
    </div>
  );
}

const Article: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const { id: idParams } = router.query;
  const [idType, id] = idParams;
  const articleQuery = idType === 's' ? ArticleBySlugQuery : ArticleByIdQuery;
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressOnScreen = useOnScreen(progressRef, '-200px');

  const { loading, error, data } = useQuery(articleQuery, { variables: { id } });

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading</div>;

  // Handle updating the progress bar
  useEffect(() => {
    const handleScroll = throttle(() => {
      const el = progressRef.current;
      const height = el?.offsetHeight || 0;
      const percentComplete = +(window.scrollY / (document.body.clientHeight - height)).toFixed(2) * 120;
      setProgress(percentComplete >= 100 ? 100 : percentComplete);
    }, 20);

    window.addEventListener('scroll', handleScroll);

    return (): void => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const article = data?.article || data?.articleBySlug;
  const authorName = `${article.author.firstName}${article.author?.lastName && ' ' + article.author.lastName}`;

  return (
    <div className="sm:w-3/5 px-5 py-5 container mx-auto relative">
      <div className="mb-8">
        {
          article?.headerImageURL && (
            <div className="mb-4">
              <HeaderImage className="w-auto -mx-5 sm:-mx-40 mb-1" url={article.headerImageURL} />
              <div className="text-xs text-center">
                photo insert photo credit here
              </div>
            </div>
          )
        }
        
        <div className="text-4xl w-full font-serif">
          {article.title}
        </div>

        <div className="text-xl w-full mb-4">
          {article?.summary}
        </div>

        <div className="text-sm w-full font-bold">
          written by <Link href={`/${article.author.username}`} ><a className="underline">{authorName}</a></Link>
          &nbsp;on {format(new Date(article.publishedAt), 'MMM do, yyyy')}
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-0 -ml-5">
          <ProgressBar className="sticky top-0 py-20 transition duration-300 ease-in" onScreen={progressOnScreen}>
            <div className="w-full h-full bg-gray-300" ref={progressRef}>
              <InnerProgressBar className="bg-primary w-full transition duration-150 ease-in" height={progress} />
            </div>
          </ProgressBar>
        </div>


        <Editor
          readOnly
          initialValue={JSON.parse(article.content)}
        />

        {
          article?.subscribersOnly && article?.contentBlocked && (
            <>
              <div className="text-center font-bold mt-2 text-primary mt-5 p-5">
                <div>
                  Oh! You edited our HTML. We trimmed the content on the server but nice try!
                </div>

                <div>
                  Please consider supporting <Link href={`/${article.author.username}`} ><a className="underline">{article.author.firstName}</a></Link>.
                </div>
              </div>

              <ContentBlocker author={article.author.firstName} />
            </>
          )
        }
      </div>
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Article));
