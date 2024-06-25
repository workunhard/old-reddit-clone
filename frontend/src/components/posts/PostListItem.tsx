import "../../styles/PostListItem.css";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import VoteIndicator from "../VoteIndicator";
import Post from "../../types/Post";
import timeAgo from "../../util/TimeAgoUtil";
import { Link } from "react-router-dom";

function PostListItem({ post }: { post: Post }) {
  const { authToken } = useAuth();
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes);
  
  const submitVote = (vote: string) => {
    if (!authToken) {
      alert("You must be logged in to vote");
      return;
    }

    axios
      .post(`http://localhost:8080/posts/${post._id}/vote`, { vote })
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
        downvotes={downvotes}
        submitVote={submitVote}
      />
      <div className="post-list-item">
        <h2 className="post-header">
          <Link className="title" to={`/${post._id}`}>
            {post.title}
          </Link>
        </h2>
        <p className="date-info">
          Submitted {timeAgo(post.createdAt)} by{" "}
          <a className="author" href="#">
            {post.author}
          </a>
        </p>
        <p className="post-body">{post.body}</p>
        <Link to={`/${post._id}`}>{post.comments.length} comments</Link>
      </div>
    </div>
  );
}

export default PostListItem;
