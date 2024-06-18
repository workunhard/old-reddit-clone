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
      <h2>
        <a className="title" href={id}>
          {title}
        </a><p>{author}</p>
      </h2>
      <p className="date-info">{submitted}</p>
      <p>{body}</p>
      <a href="#">{comments} comments</a>
    </div>
  );
}

export default postListItem;
