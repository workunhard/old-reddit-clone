import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; 2024 Reddit Clone</p>
        </div>
        <div className="footer-center"> 
          <a href="/Code" className="footer-link">Made by Code</a>
        </div>
        <div className="footer-right">
          <a href="https://instagram.com">IG</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;