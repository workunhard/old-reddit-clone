import "../styles/TopNav.css";

function TopNav() {
  return (
    <nav className="top-nav">
      <div className="nav-left">
        <a href="/" className="company-name">
          Reddit Clone
        </a>
      </div>
      <div className="nav-right">
        <>
          <button className="nav-button">
            Sign In | Register
          </button>
        </>
      </div>
    </nav>
  );
}

export default TopNav;
