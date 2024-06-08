import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PostPage.css";

function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/${postId}`).then((response) => {
      setPost(response.data);
    });
  }, []);

  const addComment = () => {
    const comment = document.querySelector("textarea")?.value;
    if (!comment) return;

    axios
      .post(`http://localhost:5000/${postId}/add-comment`, { comment })
      .then((response) => {
        console.log(response.data);
      });
  };

  return (
    <>
      {post && (
        <>
          <div className="post-container">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
          <div className="comment-input">
            <textarea placeholder="Add a comment" />
          </div>
          <button className="submit-btn" onClick={addComment}>Submit</button>
          {post.comments &&
            post.comments.map((comment, index) => (
              <div key={index} className="comment-container">
                <p>{comment}</p>
              </div>
            ))}
        </>
      )}
    </>
  );
}

export default PostPage;
