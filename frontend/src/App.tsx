import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import TopNav from "./components/TopNav";
import Body from "./components/Body";
import PostPage from "./components/PostPage";
import Login from "./components/login/Login";
import "./styles/App.css";
import { AuthProvider } from "./hooks/AuthContext";

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="app-container">
        <div className="header-content">
          <TopNav />
        </div>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/login" element={<Login />} />
            <Route path="/:postId" element={<PostPage />} />
          </Routes>
        </div>
        <div className="footer-content">
          <Footer />
        </div>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
