import "../../styles/CreatePostModal.css";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../LoadingSpinner";

interface ModalProps {
  closeModal: () => void;
  submitPost: (title: string, body: string) => void;
}

const CreatePostModal: React.FC<ModalProps> = ({ closeModal, submitPost }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");
  const { authToken } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!authToken) {
        console.error("User not logged in");
        return;
      }
      await submitPost(title, body);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="header">
          <h2>Create a Post</h2>
          <button onClick={closeModal} className="close-modal-btn">
            X
          </button>
        </div>
        <form className="form-fields" onSubmit={handleSubmit}>
          <input
            type="text"
            className="post-title-field"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="post-area"
            placeholder="Type your post here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <div className="center">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <button type="submit" className="submit-btn">
                Post
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
