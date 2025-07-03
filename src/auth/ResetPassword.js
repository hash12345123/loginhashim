import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isValidCode, setIsValidCode] = useState(false);
  const [oobCode, setOobCode] = useState("");
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (code) {
      setOobCode(code);
      verifyResetCode(code);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const verifyResetCode = async (code) => {
    try {
      await verifyPasswordResetCode(auth, code);
      setIsValidCode(true);
    } catch (err) {
      setError("This password reset link is invalid or has expired. Please request a new one.");
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length === 0) return "";
    if (!minLength) return "Too short";
    if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar) return "Strong";
    if ((hasUpperCase || hasLowerCase) && hasNumbers) return "Medium";
    return "Weak";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(validatePassword(newPassword));
    setError("");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess("Password has been reset successfully! You can now login with your new password.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      let errorMessage = "Failed to reset password.";
      
      switch (err.code) {
        case 'auth/expired-action-code':
          errorMessage = "This password reset link has expired. Please request a new one.";
          break;
        case 'auth/invalid-action-code':
          errorMessage = "Invalid reset link. Please request a new password reset.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please choose a stronger password.";
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

  if (!isValidCode && !error) {
    return (
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
        <div className="w-full h-full bg-white/95 backdrop-blur-sm relative z-10 flex flex-col justify-center items-center">
          <div className="w-full h-full flex flex-col justify-center items-center px-4 py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-xs sm:text-sm">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse"></div>
      
      <div className="w-full h-full bg-white/95 backdrop-blur-sm relative z-10 flex flex-col justify-center items-center">
        <div className="w-full h-full flex flex-col justify-center items-center px-4 py-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
            Set New Password
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-6 text-center px-4">
            Enter your new password below
          </p>
          
          {success && (
            <div className="w-full max-w-sm bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-xs sm:text-sm border-l-4 border-green-500">
              {success}
            </div>
          )}
          
          {error && (
            <div className="w-full max-w-sm bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-xs sm:text-sm border-l-4 border-red-500">
              {error}
            </div>
          )}
          
          <form onSubmit={handleResetPassword} className="w-full max-w-sm space-y-4">
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 text-xs sm:text-sm border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {passwordStrength && (
                <div className={`text-xs font-medium mt-1 ${
                  passwordStrength === "Strong" ? "text-green-600" :
                  passwordStrength === "Medium" ? "text-blue-600" :
                  passwordStrength === "Weak" ? "text-yellow-600" :
                  "text-red-600"
                }`}>
                  Password Strength: {passwordStrength}
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearMessages();
                  }}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 text-xs sm:text-sm border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 sm:py-3 text-xs sm:text-sm uppercase tracking-wide rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:text-purple-600 text-xs sm:text-sm font-semibold transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-50"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
 