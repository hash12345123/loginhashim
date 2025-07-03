import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
      navigate("/home"); 
      }, 1000);
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email address.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password. Please try again.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse"></div>
      
      <div className="w-full h-full bg-white/95 backdrop-blur-sm relative z-10 flex flex-col justify-center items-center">
        <div className="w-full h-full flex flex-col justify-center items-center px-4 py-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-6 text-center px-4">
            Sign in to your account to continue
          </p>
          
          {error && (
            <div className="w-full max-w-sm bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-xs sm:text-sm border-l-4 border-red-500">
              {error}
            </div>
          )}
          
          {success && (
            <div className="w-full max-w-sm bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-xs sm:text-sm border-l-4 border-green-500">
              {success}
        </div>
          )}
          
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearMessages();
                }}
                placeholder="Enter your email"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearMessages();
                  }}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 text-xs sm:text-sm border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-blue-500 hover:text-purple-600 text-xs sm:text-sm font-semibold transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-50"
              >
                Forgot Password?
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 sm:py-3 text-xs sm:text-sm uppercase tracking-wide rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-blue-500 hover:text-purple-600 font-semibold transition-colors duration-200 px-1 py-1 rounded hover:bg-blue-50"
              >
                Sign up here
              </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;