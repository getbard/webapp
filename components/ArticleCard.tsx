import { Article } from '../generated/graphql';

function ArticleCard({ data }: { data: Article }): React.ReactElement {
  return (
    <div>
      <h1>{data.title}</h1>
      {data.content}
    </div>
  );
}

export default ArticleCard;
