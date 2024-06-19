import "../styles/TopNav.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TopNav() {
  const { authToken, displayName, setAuthToken, setDisplayName } = useAuth();
  const loggedIn = !!authToken;
  const [currUser] = useState(displayName);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthToken(null);
    setDisplayName(null);
    navigate("/");
  };

  return (
    <nav className="top-nav">
      <div className="nav-left">
        <a href="/" className="company-name">
          Old Reddit Clone
        </a>
      </div>
      <div className="nav-right">
        {loggedIn ? (
          <>
            <a className="profile-name" href="#">
              {currUser}
            </a>
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="nav-button" onClick={() => navigate("/login")}>
            Sign In | Register
          </button>
        )}
      </div>
    </nav>
  );
}

export default TopNav;
