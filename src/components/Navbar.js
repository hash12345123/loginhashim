import React from 'react';

const Navbar = ({ onToggleSidebar, userName, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <button 
          className="sidebar-toggle" 
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar menu"
        >
          ☰
        </button>
        <h1 className="nav-title">Dashboard</h1>
      </div>
      <div className="nav-right">
        <span className="user-greeting">Welcome, {userName}!</span>
        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 