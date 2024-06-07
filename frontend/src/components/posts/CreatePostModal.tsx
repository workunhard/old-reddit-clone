import "./CreatePostModal.css";
import React from "react";

function Modal({
  closeModal,
  submitPost,
}: {
  closeModal: () => void;
  submitPost: (title: string, body: string) => void;
}) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    await submitPost(title, body);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="header">
          <h2>Create a Post</h2>
          <button onClick={closeModal}>x</button>
        </div>
        <form className="form-fields" onSubmit={handleSubmit}>
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
