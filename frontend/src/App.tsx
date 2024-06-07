import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import TopNav from "./components/TopNav";
import Body from "./components/Body";
import PostPage from "./components/PostPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="header-content">
          <TopNav />
        </div>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/:postId" element={<PostPage />} />
          </Routes>
        </div>
        <div className="footer-content">
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
