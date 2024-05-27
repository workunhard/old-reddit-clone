import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; 2024 Reddit Clone</p>
        </div>
        <div className="footer-center">
          <a href="/about" className="footer-link">About</a>
          <a href="/contact" className="footer-link">Contact</a>
          <a href="/privacy" className="footer-link">Privacy Policy</a>
        </div>
        <div className="footer-right">
          <a href="https://facebook.com" className="social-icon">FB</a>
          <a href="https://twitter.com" className="social-icon">TW</a>
          <a href="https://instagram.com" className="social-icon">IG</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;