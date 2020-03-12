function ArticleCard({ data }: { data: any }): React.ReactElement {
  console.log(data);
  return (
    <div>
      <h1>{data.title}</h1>
      {data.content}
    </div>
  );
}

export default ArticleCard;
