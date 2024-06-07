import Footer from "./components/Footer";
import TopNav from "./components/TopNav";
import Body from "./components/Body";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="header-content">
        <TopNav />
      </div>
      <div className="main-content">
        <Body />
      </div>
      <div className="footer-content">
        <Footer />
      </div>
    </div>
  );
}

export default App;
