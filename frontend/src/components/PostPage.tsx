import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PostPage.css";
import Post from "../types/Post";

function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/${postId}`).then((response) => {
      setPost(response.data);
    });
  }, [postId]);

  const addComment = () => {
    const comment =
      document.querySelector<HTMLTextAreaElement>("textarea")?.value;
    if (!comment) return;

    axios
      .post(`http://localhost:5000/${postId}/add-comment`, { comment })
      .then(() => {
        if (post) {
          setPost({ ...post, comments: [...post.comments, comment] });
        }
      });
  };

  return (
    <>
      {post ? (
        <>
          <div className="post-container">
            <div className="post-content-container">
              <div className="post-header">
                <h2>{post.title}</h2>
              </div>
              <p>{post.body}</p>
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
            {post.comments.map((comment: string, index: number) => (
              <div key={index} className="comment-container">
                {/* <a href="#" className="comment-user">{comment}</a> */}
                <p>{comment}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default PostPage;
