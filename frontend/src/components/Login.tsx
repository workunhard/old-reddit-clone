import styles from "../styles/Login.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuthToken, setDisplayName: updateDisplayName } = useAuth();
  const baseUrl = "https://orc-api.codes-test-domain.com";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(baseUrl + "/login", {
        email,
        password,
      });
      const { token, displayName } = response.data;
      setAuthToken(token);
      updateDisplayName(displayName);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Invalid credentials (WIP)");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl + "/register", {
        email,
        password,
        displayName,
      });
      setShowLogin(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.contentContainer}>
      <div className={styles.loginContainer}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {showLogin ? (
              <>
                <h1>Sign in</h1>
                {error && <p className={styles.error}>{error}</p>}
                <form className={styles.formFields} onSubmit={handleLogin}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button className={styles.loginBtn} type="submit">
                    Login
                  </button>
                </form>
                <p className="message">Not a user?</p>
                <button
                  className={styles.toggle}
                  onClick={() => setShowLogin(false)}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                <h1>Sign Up</h1>
                <form className={styles.formFields} onSubmit={handleRegister}>
                  <input
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoComplete="name"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button className={styles.loginBtn} type="submit">
                    Create Account
                  </button>
                </form>
                <p>Already a user?</p>
                <button
                  className={styles.toggle}
                  onClick={() => setShowLogin(true)}
                >
                  Log in
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
