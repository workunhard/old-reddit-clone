import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/App.css";
import CreatePostModal from "./posts/CreatePostModal";
import PostListItem from "./posts/PostListItem";
import Post from "../types/Post";


function Body() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchPosts = () => {
    axios
      .get("http://localhost:5000/get-posts")
      .then((response) => {
        // Sort posts based on lastActivity timestamp in descending order
        const sortedPosts = response.data.sort((a: Post, b: Post) => {
          const dateA = new Date(a.createdAt).getTime(); // Convert to milliseconds
          const dateB = new Date(b.createdAt).getTime(); // Convert to milliseconds
          return dateB - dateA; // Sort in descending order
        });
        setPosts(sortedPosts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const submitPost = async (title: string, body: string) => {
    await axios.post("http://localhost:5000/create-post", { title, body });
    fetchPosts(); // Fetch posts again after submitting a new post
    closeModal();
  };

  function timeAgo(postDate: string): string {
    const now = new Date();
    const original = new Date(postDate);

    const differenceInSeconds = Math.floor(
      (now.getTime() - original.getTime()) / 1000
    );

    const minutes = Math.floor(differenceInSeconds / 60);
    const hours = Math.floor(differenceInSeconds / 3600);
    const days = Math.floor(differenceInSeconds / 86400);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${differenceInSeconds} second${
        differenceInSeconds !== 1 ? "s" : ""
      } ago`;
    }
  }

  return (
    <>
      <div>
        <button onClick={showModal}>Create a Post</button>
        {isModalOpen && (
          <CreatePostModal submitPost={submitPost} closeModal={closeModal} />
        )}
      </div>
      {posts.map((post) => (
        <PostListItem
          key={post._id}
          title={post.title}
          submitted={timeAgo(post.createdAt)}
          body={post.body}
          comments={post.comments.length}
          id={post._id}
        />
      ))}
    </>
  );
}

export default Body;
