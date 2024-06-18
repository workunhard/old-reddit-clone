import "./PostListItem.css";

function postListItem({
  title,
  submitted,
  body,
  comments,
  id,
  author,
}: {
  title: string;
  submitted: string;
  body: string;
  comments: number;
  id: string;
  author: string;
}) {
  return (
    <div className="post-list-item">
      <h2 className="post-header">
        <a className="title" href={id}>
          {title}
        </a>
      </h2>
      <p className="date-info">
        Submitted {submitted} by{" "}
        <a className="author" href="#">
          {author}
        </a>
      </p>
      <p className="post-body">{body}</p>
      <a href={id}>{comments} comments</a>
    </div>
  );
}

export default postListItem;
