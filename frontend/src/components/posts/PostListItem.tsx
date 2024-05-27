import './PostListItem.css';

function postListItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="post-list-item">
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

export default postListItem;
