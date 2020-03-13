import { Article } from '../generated/graphql';

function ArticleCard({ data }: { data: Article }): React.ReactElement {
  const imageSrc = data.headerImageURL || undefined;
  return (
    <div className="p-5 m-5 border border-black">
      {
        imageSrc
         ? <img className="mb-5" src ={imageSrc} />
         : null
      }

      <h1>{data.title}</h1>
      {data.subtitle}
    </div>
  );
}

export default ArticleCard;
