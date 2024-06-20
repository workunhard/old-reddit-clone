import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();
  const { setAuthToken, setDisplayName: updateDisplayName } = useAuth(); // Rename to prevent TS Error
  const baseUrl = "http://localhost:8080";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(baseUrl + "/login", {
        email,
        password,
      });
      const { token, displayName } = response.data;
      setAuthToken(token);
      updateDisplayName(displayName); // from useAuth
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(baseUrl + "/register", {
        email,
        password,
        displayName,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {showLogin ? (
        <>
          <div>Login</div>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
          <p>
            Not a user?{" "}
            <button onClick={() => setShowLogin(false)}>Register here</button>
          </p>
        </>
      ) : (
        <>
          <div>Register</div>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Register</button>
          </form>
          <p>
            Already a user?{" "}
            <button onClick={() => setShowLogin(true)}>Login here</button>
          </p>
        </>
      )}
    </div>
  );
};

export default Login;
