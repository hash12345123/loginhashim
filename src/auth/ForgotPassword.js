import React, { useState } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("A password reset link has been sent to your email. Please check your inbox and follow the instructions.");
    } catch (err) {
      let errorMessage = "Failed to send reset email.";
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email address.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many requests. Please try again later.";
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
    setResetMessage("");
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse"></div>
      
      <div className="w-full h-full bg-white/95 backdrop-blur-sm relative z-10 flex flex-col justify-center items-center">
        <div className="w-full h-full flex flex-col justify-center items-center px-4 py-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
            Reset Password
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-6 text-center px-4">
            Enter your email to receive a password reset link
          </p>
          
          {resetMessage && (
            <div className="w-full max-w-sm bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-xs sm:text-sm border-l-4 border-green-500">
              {resetMessage}
            </div>
          )}
          
          {error && (
            <div className="w-full max-w-sm bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-xs sm:text-sm border-l-4 border-red-500">
              {error}
            </div>
          )}
          
          <form onSubmit={handleResetPassword} className="w-full max-w-sm space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearMessages();
                }}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 sm:py-3 text-xs sm:text-sm uppercase tracking-wide rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          
          <div className="mt-4 flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:text-purple-600 text-xs sm:text-sm font-semibold transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-50"
            >
              ← Back to Login
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-blue-500 hover:text-purple-600 text-xs sm:text-sm font-semibold transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-50"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
 