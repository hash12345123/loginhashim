import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: "gray", text: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: score, color: "red", text: "Weak" };
    if (score <= 3) return { strength: score, color: "yellow", text: "Fair" };
    if (score <= 4) return { strength: score, color: "blue", text: "Good" };
    return { strength: score, color: "green", text: "Strong" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
      navigate("/home");
      }, 1000);
    } catch (err) {
      let errorMessage = "Signup failed. Please try again.";
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
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

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse"></div>
      
      <div className="w-full h-full bg-white/95 backdrop-blur-sm relative z-10 flex flex-col justify-center items-center">
        <div className="w-full h-full flex flex-col justify-center items-center px-4 py-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
            Create Account
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-6 text-center px-4">
            Join us and start your journey
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
          
          <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearMessages();
                }}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white"
                required
              />
            </div>
            
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color === "red"
                                ? "bg-red-500"
                                : passwordStrength.color === "yellow"
                                ? "bg-yellow-500"
                                : passwordStrength.color === "blue"
                                ? "bg-blue-500"
                                : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.color === "red"
                        ? "text-red-600"
                        : passwordStrength.color === "yellow"
                        ? "text-yellow-600"
                        : passwordStrength.color === "blue"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}>
                      {passwordStrength.text}
            </span>
          </div>
                  <p className="text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </p>
            </div>
          )}
        </div>
            
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                    clearMessages();
              }}
                  placeholder="Confirm your password"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 text-xs sm:text-sm border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white"
              required
            />
                <button
                  type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
            >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      password === confirmPassword ? "bg-green-500" : "bg-red-500"
                    }`}></div>
                    <span className={`text-xs font-medium ${
                      password === confirmPassword ? "text-green-600" : "text-red-600"
                    }`}>
                      {password === confirmPassword ? "Passwords match" : "Passwords don't match"}
            </span>
          </div>
        </div>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 sm:py-3 text-xs sm:text-sm uppercase tracking-wide rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-blue-500 hover:text-purple-600 font-semibold transition-colors duration-200 px-1 py-1 rounded hover:bg-blue-50"
              >
                Sign in here
              </Link>
      </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;