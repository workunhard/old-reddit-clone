import "../App.css";
import "../styles/Layout.css";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";
import Body from "../components/Body";

function Layout() {
  return (
    <>
      <div className="header-content">
        <TopNav />
      </div>
      <div className="main-content">
        <Body />
      </div>
      <div className="footer-content">
        <Footer />
      </div>
    </>
  );
}

export default Layout;
