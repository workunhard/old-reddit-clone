import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import CreatePostModal from "./posts/CreatePostModal";
import PostListItem from "./posts/PostListItem";

function Body() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Fetch posts data from the server when the component mounts
    axios.get("http://localhost:5000/get-posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <>
      <div>
        <button onClick={showModal}>Create a Post</button>
        {isModalOpen && <CreatePostModal closeModal={closeModal} />}
      </div>
      {posts.map((post: any) => (
        <PostListItem key={post.id} title={post.title} body={post.body} />
      ))}
    </>
  );
}

export default Body;
