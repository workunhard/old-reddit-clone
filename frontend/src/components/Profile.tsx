import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import arrowLeft from "../assets/arrow-left.svg";
import "../styles/Profile.css";
import ActivityLog from "./ActivityLog";
import Comment from "../types/Comment";

interface User {
  uid: string;
  email: string;
  postSubmissions: string[];
  comments: string[];
  createdAt: { _seconds: number; _nanoseconds: number };
}
function Profile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get<User>(
          `http://localhost:8080/users/${username}`
        );
        setUser(userResponse.data);

        // Fetch user comments
        const commentsResponse = await axios.get<Comment[]>(
          `http://localhost:8080/users/${username}/comments`
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // Function to format Firestore Timestamp to a readable date string
  const formatDate = (timestamp: {
    _seconds: number;
    _nanoseconds: number;
  }) => {
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString();
  };

  return (
    <>
      <div className="profile-container">
        <Link to="/" className="back-btn">
          <img src={arrowLeft} alt="back" />
          <span>Back</span>
        </Link>
        <div className="profile-details">
          <h1>{username}</h1>
          {user ? (
            <div>
              <p>Email: {user.email}</p>
              <p>Number of Posts: {user.postSubmissions.length}</p>
              <p>Number of Comments: {user.comments.length}</p>
              <p>
                Date joined:{" "}
                {user.createdAt ? formatDate(user.createdAt) : "Unknown"}
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="activity-log">
          <ActivityLog comments={comments} />
        </div>
      </div>
    </>
  );
}

export default Profile;
