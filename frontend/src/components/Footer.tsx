import "../styles/Footer.css";
import Github from "../assets/github-mark-white.svg";

function Footer() {
  return (
    <footer className="footer">
        <div className="footer-left">
          <p>&copy; 2024 Reddit Clone</p>
        </div>
        <div className="footer-center">
          <a href="/Code" className="footer-link">
            Made by Code
          </a>
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
