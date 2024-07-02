import "../styles/PostPage.css";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Post from "../types/Post";
import Comment from "../types/Comment";
import timeAgo from "../util/TimeAgoUtil";
import VoteIndicator from "./VoteIndicator";
import arrowLeft from "../assets/arrow-left.svg";
import LoadingSpinner from "./LoadingSpinner";  // Add this import

function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const { authToken, displayName } = useAuth();
  const baseUrl = "http://old-reddit-backend.us-west-2.elasticbeanstalk.com";

  useEffect(() => {
    axios.get(`${baseUrl}/${postId}`).then((response) => {
      setPost(response.data);
    });
  }, [postId]);

  const addComment = () => {
    if (!authToken) {
      alert("You must be logged in to comment");
      return;
    }

    const commentBody =
      document.querySelector<HTMLTextAreaElement>("textarea")?.value;
    if (!commentBody) return;

    const newComment: Comment = {
      _id: "temp-id-" + new Date().getTime(),
      body: commentBody,
      author: displayName || "Anonymous",
      parentID: postId as string,
      comments: [],
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
    };

    axios
      .post(
        `${baseUrl}/${postId}/add-comment`,
        {
          comment: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        const updatedComment = response.data;
        if (post) {
          setPost({ ...post, comments: [...post.comments, updatedComment] });
        }
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
        // Handle error appropriately, e.g., show a message to the user
      });
  };

  const renderComments = (comments: Comment[]) => {
    return comments.map((comment: Comment) => (
      <div key={comment._id} className="comment-container">
        <div className="comment-header">
          <Link to={`../users/${comment.author}`} className="comment-author">
            {comment.author}
          </Link>
          <p>{timeAgo(comment.createdAt)}</p>
        </div>
        <p className="comment-body">{comment.body}</p>
        <a href="#" className="reply-link">
          reply(WIP)
        </a>
        {comment.comments && comment.comments.length > 0 && (
          <div className="nested-comments">
            {renderComments(comment.comments)}
          </div>
        )}
      </div>
    ));
  };

  const submitVote = (vote: string) => {
    if (!authToken) {
      alert("You must be logged in to vote");
      return;
    }

    axios
      .post<Post>(
        `http://localhost:8080/posts/${postId}/vote`,
        { vote },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error("Error voting on post:", error);
        if (error.response && error.response.status === 401) {
          alert("Your session has expired. Please log in again.");
          // Implement a function to log out the user and redirect to login page
        }
      });
  };

  return (
    <>
      {post ? (
        <>
          <Link to="/" className="back-btn">
            <img src={arrowLeft} alt="back" />
            <span>Back</span>
          </Link>
          <div className="post-area-container">
            <div className="post-main-container">
              <VoteIndicator
                upvotes={post.upvotes}
                downvotes={post.downvotes}
                submitVote={submitVote}
              />
              <div className="post-content-container">
                <div className="title-header">
                  <h2>{post.title}</h2>
                  <p className="submission-info">
                    Submitted {timeAgo(post.createdAt)} by{" "}
                    {
                      <Link to={`/users/${post.author}`} className="author">
                        {post.author}
                      </Link>
                    }
                  </p>
                </div>
                <p>{post.body}</p>
              </div>
            </div>
            <div className="comment-input">
              <textarea placeholder="Add a comment" />
              <button className="submit-btn" onClick={addComment}>
                Submit
              </button>
            </div>
          </div>
          <div className="comments-section">
            <h3>Comments ({post.comments.length})</h3>
            {renderComments(post.comments as unknown as Comment[])}
          </div>
        </>
      ) : (
        <LoadingSpinner />  // This replaces the previous <p>Loading...</p>
      )}
    </>
  );
}

export default PostPage;