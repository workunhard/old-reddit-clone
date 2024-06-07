import "./PostListItem.css";

function postListItem({
  title,
  submitted,
  body,
  comments,
  id,
}: {
  title: string;
  submitted: string;
  body: string;
  comments: number;
  _id: string;
}) {
  return (
    <div className="post-list-item">
      <h2>
        <a className="title" href={id}>
          {title}
        </a>
      </h2>
      <p className="date-info">{submitted}</p>
      <p>{body}</p>
      <a href="#">{comments} comments</a>
    </div>
  );
}

export default postListItem;
