import "../styles//TopNav.css";

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
          <a href="/signin" className="nav-button">
            Sign In | Register
          </a>
        </>
      </div>
    </nav>
  );
}

export default TopNav;
