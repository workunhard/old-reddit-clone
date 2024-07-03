import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import arrowLeft from "../assets/arrow-left.svg";
import "../styles/Profile.css";
import ActivityLog from "./ActivityLog";
import Comment from "../types/Comment";
import { useAuth } from "../context/AuthContext";

interface User {
  uid: string;
  email: string;
  postSubmissions: string[];
  comments: string[];
  createdAt: { _seconds: number; _nanoseconds: number };
}
function Profile() {
  const { setAuthToken, setDisplayName } = useAuth();
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const baseUrl = "https://orc-api.codes-test-domain.com";

  const handleLogout = () => {
    setAuthToken(null);
    setDisplayName(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userResponse = await axios.get<User>(
          `${baseUrl}/users/${username}`
        );
        setUser(userResponse.data);

        const commentsResponse = await axios.get<Comment[]>(
          `${baseUrl}/users/${username}/comments`
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
          <h1 className="username">{username}</h1>
          {user ? (
            <>
              <p>Email: {user.email}</p>
              <p>Number of Posts: {user.postSubmissions.length}</p>
              <p>Number of Comments: {user.comments.length}</p>
              <p>
                Date joined:{" "}
                {user.createdAt ? formatDate(user.createdAt) : "Unknown"}
              </p>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
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
