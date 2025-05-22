import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase"; 
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await  signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");

    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("A password reset link has been sent to your email.");
    } catch (err) {
      setError(err.message);
    }
  };

  console.log("showForgotPassword:", showForgotPassword); 

  return (
    <div className="login-container">
      {showForgotPassword ? (
        // 🛠️ FIXED: Forgot Password form properly structured
        <div className="forgot-password-container active">
          <h2>Reset Password</h2>
          {resetMessage && <p className="success">{resetMessage}</p>}
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleForgotPassword}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                // placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Send Reset Link</button>
          </form>
          <p>
            <button
              type="button"
              className="link-button"
              onClick={() => setShowForgotPassword(false)}
            >
              Back to Login
            </button>
          </p>
        </div>
      ) : (
        <>
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                // placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                // placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
            </div>
            <div className="forgot-password">
              <a href="#" onClick={(e)=>{ e.preventDefault(); setShowForgotPassword(true); }}>

             
                Forgot Password?
                </a>
            </div>
            <button type="submit">Login</button>
          </form>
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </>
      )}
    </div>
  );
};

export default Login;