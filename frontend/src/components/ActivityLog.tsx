import React from 'react';
import Comment from '../types/Comment';
import timeAgo from "../util/TimeAgoUtil";

interface Props {
  comments: Comment[];
}

const ActivityLog: React.FC<Props> = ({ comments }) => {
  return (
    <>
      <div className="comments-section">
        <h2>Activity Log</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-container">
              <p>{comment.body}</p>
              <p>{timeAgo(comment.createdAt)}</p>
            </div>
          ))
        ) : (
          <p>No comments found</p>
        )}
      </div>
    </>
  );
};

export default ActivityLog;
