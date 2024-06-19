import VoteIndicator from "../VoteIndicator";
import "./PostListItem.css";
import axios from "axios";
import { useAuth } from "../../hooks/AuthContext";
import Post from "../../types/Post";
import timeAgo from "../../hooks/TimeAgoUtil";
import { useState } from "react";

function PostListItem({ post }: { post: Post }) {
  const { authToken } = useAuth();
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [dowvotes, setDownvotes] = useState(post.downvotes);
  const submitVote = (vote: string) => {
    if (!authToken) {
      alert("You must be logged in to vote");
      return;
    }

    axios
      .post(`http://localhost:5000/posts/${post._id}/vote`, { vote })
      .then((response) => {
        setUpvotes(response.data.upvotes);
        setDownvotes(response.data.downvotes);
      })
      .catch((error) => {
        console.error("Error voting on post:", error);
      });
  };

  return (
    <div className="post-list-container">
      <VoteIndicator
        upvotes={upvotes}
        downvotes={dowvotes}
        submitVote={submitVote}
      />
      <div className="post-list-item">
        <h2 className="post-header">
          <a className="title" href={post._id}>
            {post.title}
          </a>
        </h2>
        <p className="date-info">
          Submitted {timeAgo(post.createdAt)} by{" "}
          <a className="author" href="#">
            {post.author}
          </a>
        </p>
        <p className="post-body">{post.body}</p>
        <a href={post._id}>{post.comments.length} comments</a>
      </div>
    </div>
  );
}

export default PostListItem;
