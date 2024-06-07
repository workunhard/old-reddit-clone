import "./PostListItem.css";

function postListItem({
  title,
  submitted,
  body,
  comments
}: {
  title: string;
  submitted: string;
  body: string;
  comments: number;
}) {
  return (
    <div className="post-list-item">
      <a className="title" href="#"><h2>{title}</h2></a>
      <p className="date-info">{submitted}</p>
      <p>{body}</p>
      <a href="#">{comments} comments</a>
    </div>
  );
}

export default postListItem;
