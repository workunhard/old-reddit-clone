import "../styles/Footer.css";
import Github from "../assets/github-mark-white.svg";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <a>&copy; 2024 Old Reddit Clone</a>
      </div>
      <div className="footer-center">
        <a>Made by Code</a>
      </div>
      <div className="footer-right">
        <a href="https://github.com/workunhard" className="github-link">
          <img src={Github} alt="GitHub" className="github-icon" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
