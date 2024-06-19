import "../../styles/CreatePostModal.css";
import React, { useState } from "react";

interface ModalProps {
  closeModal: () => void;
  submitPost: (title: string, body: string) => void;
}

const CreatePostModal: React.FC<ModalProps> = ({ closeModal, submitPost }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [displayName] = useState(localStorage.getItem("displayName") || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName === null) return console.error("User not logged in");
    await submitPost(title, body);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="header">
          <h2>Create a Post</h2>
          <button onClick={closeModal} className="close-modal-btn">X</button>
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
          <button type="submit" className="submit-btn">Post</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
