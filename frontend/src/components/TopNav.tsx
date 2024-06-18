import "../styles/TopNav.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

function TopNav() {
  const { authToken, setAuthToken } = useAuth();
  const loggedIn = !!authToken;
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthToken(null);
    navigate('/login');
  };

  return (
    <nav className="top-nav">
      <div className="nav-left">
        <a href="/" className="company-name">
          Reddit Clone
        </a>
      </div>
      <div className="nav-right">
        {loggedIn ? (
          <>
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
