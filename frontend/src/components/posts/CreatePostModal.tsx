import axios from "axios";
import "./CreatePostModal.css";
import React from "react";

function Modal({ closeModal }: { closeModal: () => void }) {



  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    axios.post("http://localhost:5000/create-post", { title, body });
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="header">
          <h2>Create a Post</h2>
          <button onClick={closeModal}>X</button>
        </div>
        <form className="form-fields" onSubmit={submitPost}>
          <input
            type="text"
            className="post-title-field"
            name="title"
            placeholder="Title"
          />
          <textarea
            className="post-area"
            name="body"
            placeholder="Type your post here..."
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
