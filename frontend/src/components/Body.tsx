import "../styles/App.css";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import CreatePostModal from "./posts/CreatePostModal";
import PostListItem from "./posts/PostListItem";
import Post from "../types/Post";

function Body() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const { authToken, displayName } = useAuth();
  const baseUrl = "https://orc-api.codes-test-domain.com";

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchPosts = async () => {
    axios
      .get(baseUrl + "/get-posts", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        // Sort posts based on lastActivity timestamp in descending order // TODO: post ranking
        const sortedPosts = response.data.sort((a: Post, b: Post) => {
          const dateA = new Date(a.createdAt).getTime(); // Convert to milliseconds
          const dateB = new Date(b.createdAt).getTime(); // Convert to milliseconds
          return dateB - dateA;
        });
        setPosts(sortedPosts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  useEffect(() => {
    fetchPosts();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  const submitPost = async (title: string, body: string) => {
    if (!authToken) {
      alert("You must be logged in to create a post");
      return;
    }

    try {
      await axios.post(
        baseUrl + "/create-post",
        { title, body, displayName }, // Pass displayName obtained from useAuth
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Pass token
          },
        }
      );
      fetchPosts();
      closeModal();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading Posts...</p>
      ) : (
        <>
          {authToken ? (
            <div className="button-bar">
              <button
                className={`create-post-btn ${!authToken ? "disabled" : ""}`}
                onClick={showModal}
                disabled={!authToken}
              >
                + Create Post
              </button>

              {isModalOpen && (
                <CreatePostModal
                  submitPost={submitPost}
                  closeModal={closeModal}
                />
              )}
            </div>
          ) : (
            <p className="login-message">
              <Link className="orange" to="/login">
                Sign in
              </Link>{" "}
              to post, comment, and vote!
            </p>
          )}
          <div>
            {isModalOpen && (
              <CreatePostModal
                submitPost={submitPost}
                closeModal={closeModal}
              />
            )}
          </div>
          {posts.map((post) => (
            <PostListItem key={post._id} post={post} />
          ))}
        </>
      )}
    </>
  );
}

export default Body;
