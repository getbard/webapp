import { useQuery } from '@apollo/react-hooks';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, TooltipProps, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { FiFeather } from 'react-icons/fi';

import ArticleAnalyticsByIdQuery from '../queries/ArticleAnalyticsByIdQuery';

import ArticleAnalyticsFallback from './ArticleAnalyticsFallback';
import GenericError from './GenericError';
import BardError from '../pages/_error';

function CustomTooltip({ payload, label, active }: TooltipProps): React.ReactElement {
  if (active) {
    return (
      <div className="bg-white p-2 rounded-sm border border-gray-300">
        <p className="">
          {format(new Date(label || 0), 'LLLL do')}
        </p>

        <p className="text-primary">
          <span className="capitalize font-bold">{payload?.[0].name}:</span>
          &nbsp;{payload?.[0].value}
        </p>

        <p className="text-secondary">
          <span className="capitalize font-bold">{payload?.[1].name}:</span>
          &nbsp;{payload?.[1].value}
        </p>
      </div>
    );
  }

  return <></>;
}

function CustomizedAxisTick({ x, y, payload }: any): React.ReactElement {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#004346" transform="rotate(-35)">{format(new Date(payload.value || 0), 'LLLL do')}</text>
    </g>
  );
}

function ArticleAnalytics({ id }: { id: string }): React.ReactElement {
  const { loading, error, data } = useQuery(ArticleAnalyticsByIdQuery, { variables: { id } });

  if (loading) return <ArticleAnalyticsFallback />;

  if (error?.message.includes('Article not found')) return <BardError statusCode={404} hasGetInitialPropsRun={true} err={null} />;
  if (error) return <div><GenericError title error={error} /></div>;

  const article = data?.article;

  const analyticsData: {
    [key: string]: any;
  } = {};

  // Populate the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    analyticsData[date] = {
      date,
      views: 0,
      reads: 0,
    };
  }

  // Add reads
  for (let i = 0; i < article?.analytics?.reads?.length; i++) {
    const { date, count } = article.analytics.reads[i];
    if (analyticsData[date]) {
      analyticsData[date] = {
        ...analyticsData[date],
        reads: (analyticsData[date].reads || 0) + count,
      };
    }
  }

  // Add views
  for (let i = 0; i < article?.analytics?.views?.length; i++) {
    const { date, count } = article.analytics.views[i];
    if (analyticsData[date]) {
      analyticsData[date] = {
        ...analyticsData[date],
        views: (analyticsData[date].views || 0) + count,
      };
    }
  }

  const chartData = Object.values(analyticsData).sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return aDate.getTime() - bDate.getTime();
  });

  return (
    <>
      <div className="sm:w-3/5 px-5 py-5 container mx-auto relative space-y-8">
        <div>
          <div className="text-4xl w-full font-serif font-bold flex items-center">
            {article.title}

            {
              article.subscribersOnly && (
                <span className="text-2xl uppercase tracking-widest text-primary px-2 py-1 font-sans">
                  <FiFeather />
                </span>
              )
            }
          </div>

          <div className="text-xl w-full mb-4 font-serif">
            {article?.summary}
          </div>

          <div className="text-lg w-full mb-6">
            Published on {format(new Date(article?.publishedAt), 'LLLL d, yyyy')}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={600}>
          <LineChart data={Object.values(chartData)} margin={{ right: 40 }}>
            <Line type="monotone" dataKey="reads" stroke="#004346" />
            <Line type="monotone" dataKey="views" stroke="#81D2C7" />
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
            <XAxis dataKey="date" height={70} tick={<CustomizedAxisTick />} />
            <YAxis type="number" domain={[0, (dataMax: number): number => (dataMax + 1) * 1.5]} />
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-10 w-1/2 bg-gray-50 rounded-sm w-full">
            <div className="text-6xl font-serif text-primary">
              {article.analytics.totalViews}
            </div>

            <div className="text-lg text-gray-600">
              Total views
            </div>
          </div>

          <div className="p-10 w-1/2 bg-gray-50 rounded-sm w-full">
            <div className="text-6xl font-serif text-primary">
              {article.analytics.totalReads}
            </div>

            <div className="text-lg text-gray-600">
              Total reads
            </div>
          </div>

          <div className="p-10 w-1/2 bg-gray-50 rounded-sm w-full">
            <div className="text-6xl font-serif text-primary">
              {article.wordCount}
            </div>

            <div className="text-lg text-gray-600">
              Words
            </div>
          </div>

          <div className="p-10 w-1/2 bg-gray-50 rounded-sm w-full">
            <div className="text-6xl font-serif text-primary">
              {article.comments.length}
            </div>

            <div className="text-lg text-gray-600">
              Comments
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArticleAnalytics;
