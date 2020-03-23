import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { format } from 'date-fns';

import ArticleBySlugQuery from '../../queries/ArticleBySlugQuery';
import ArticleByIdQuery from '../../queries/ArticleByIdQuery';

import { withApollo } from '../../lib/apollo';
import withLayout from '../../components/withLayout';
import Editor from '../../components/Editor';

const Article: NextPage = (): React.ReactElement => {
  const router = useRouter();
  const { id: idParams } = router.query;
  const [idType, id] = idParams;
  const articleQuery = idType === 's' ? ArticleBySlugQuery : ArticleByIdQuery;

  const { loading, error, data } = useQuery(articleQuery, { variables: { id } });

  if (error) return <div>Error</div>;
  if (loading) return <div>Loading</div>;

  const article = data?.article || data?.articleBySlug;
  const authorName = `${article.author.firstName}${article.author?.lastName && ' ' + article.author.lastName[0] + '.'}`;

  return (
    <div className="sm:w-3/5 px-5 pt-5 container mx-auto relative">
      <div className="mb-8">
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

      <Editor
        readOnly
        initialValue={JSON.parse(article.content)}
      />
    </div>
  );
}

export default withApollo({ ssr: true })(withLayout(Article));
