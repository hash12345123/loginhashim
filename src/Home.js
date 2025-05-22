import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  if (loading) {
    return <h2>Loading...</h2>; // Show loading state while fetching user
  }

  if (!user) {
    navigate("/login"); // Redirect to login if user is not authenticated
    return null;
  }

  // Extract user name or fallback to email/placeholder
  const userName = user?.displayName || user?.email?.split("@")[0] || "User";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      auth.signOut();
      navigate("/login");
    }
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <ul>
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/about")}>About</li>
          <li onClick={() => navigate("/contact")}>Contact Us</li>
        </ul>
      </nav>

      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="profile-section">
            <h2>👤 {userName}</h2> {/* Display user name */}
            <ul>
              <li onClick={() => navigate("/profile")}>Profile</li>
              <li onClick={() => navigate("/addresses")}>Addresses</li>
              <li onClick={() => navigate("/credit-cards")}>Credit Cards</li>
              <li onClick={() => navigate("/order-history")}>Order History</li>
              <li onClick={() => navigate("/update-password")}>Update Password</li>
              <li onClick={() => navigate("/membership")}>Membership</li>
              <li onClick={() => navigate("/rewards-history")}>Rewards History</li>
              <li onClick={handleLogout}>🚪 Logout</li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="content">
          <header className="header">
            <h1>Welcome Back, {userName}! 👋</h1>
            <p>Explore your dashboard and manage your activities.</p>
          </header>

          {/* Cards Container */}
          <div className="cards-container">
            <div className="card" onClick={() => navigate("/profile")}>
              <h2>👤 Profile</h2>
              <p>View and update your personal information.</p>
            </div>

            <div className="card" onClick={() => navigate("/settings")}>
              <h2>⚙️ Settings</h2>
              <p>Customize your preferences and account settings.</p>
            </div>

            <div className="card" onClick={() => navigate("/analytics")}>
              <h2>📊 Analytics</h2>
              <p>Track your activities with insightful reports.</p>
            </div>

            <div className="card logout" onClick={handleLogout}>
              <h2>🚪 Logout</h2>
              <p>Securely exit your account.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;