import "../styles/TopNav.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TopNav() {
  const { authToken, displayName, setAuthToken, setDisplayName } = useAuth();
  const loggedIn = !!authToken;
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthToken(null);
    setDisplayName(null);
    navigate("/");
  };

  return (
    <nav className="top-nav">
      <div className="nav-left">
        <Link to="/" className="company-name">
          Old Reddit Clone
        </Link>
      </div>
      <div className="nav-right">
        {loggedIn ? (
          <>
            <Link className="profile-name" to={`/users/${displayName}`}>
              {displayName}
            </Link>
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
