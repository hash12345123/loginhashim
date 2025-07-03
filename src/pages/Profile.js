import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar } from '../components';
import '../Home.css';

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate about technology and innovation. Always looking for new challenges and opportunities to grow.',
    location: 'New York, NY',
    website: 'https://example.com',
    company: 'Tech Solutions Inc.',
    jobTitle: 'Frontend  Developer',
    birthday: '1990-05-15',
    gender: 'Prefer not to say'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileOrTablet = window.innerWidth < 1024;
      setIsMobile(isMobileOrTablet);
      if (isMobileOrTablet) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const userName = user?.displayName || user?.email?.split("@")[0] || "User";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      auth.signOut();
      navigate("/login");
    }
  };

  const handleNavigation = (route) => {
    if (route === "logout") {
      handleLogout();
    } else {
      navigate(`/${route}`);
    }
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const sidebarItems = [
    { id: "dashboard", label: "🏠 Dashboard", icon: "🏠" },
    { id: "profile", label: "👤 Profile", icon: "👤" },
    { id: "addresses", label: "📍 Addresses", icon: "📍" },
    { id: "credit-cards", label: "💳 Credit Cards", icon: "💳" },
    { id: "order-history", label: "📋 Order History", icon: "📋" },
    { id: "update-password", label: "🔒 Update Password", icon: "🔒" },
    { id: "membership", label: "👑 Membership", icon: "👑" },
    { id: "rewards-history", label: "🎁 Rewards History", icon: "🎁" },
    { id: "settings", label: "⚙️ Settings", icon: "⚙️" },
    { id: "logout", label: "🚪 Logout", icon: "🚪" }
  ];

  return (
    <div className="home-container">
      <div 
        className={`sidebar-overlay ${!sidebarCollapsed && isMobile ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>

      <Navbar 
        onToggleSidebar={toggleSidebar}
        userName={userName}
        onLogout={handleLogout}
      />

      <div className="main-content">
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          userName={userName}
          userEmail={user.email}
          sidebarItems={sidebarItems}
          activeTab="profile"
          onItemClick={(id) => handleNavigation(id)}
        />

        <div className="content">
          <header className="content-header">
            <h1>👤 Profile</h1>
            <p>Manage your personal information and preferences</p>
          </header>

          <div className="profile-page">
            {/* Profile Header */}
            <div className="profile-header">
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${userName}&background=667eea&color=fff&size=120`} 
                    alt={userName}
                  />
                  <div className="avatar-overlay">
                    <span>📷</span>
                  </div>
                </div>
                <div className="profile-status">
                  <span className="status-indicator online"></span>
                  <span>Online</span>
                </div>
              </div>
              <div className="profile-info">
                <h2>{userName}</h2>
                <p className="user-email">{user.email}</p>
                <p className="user-bio">{formData.bio}</p>
                <div className="profile-actions">
                  <button 
                    className={`edit-profile-btn ${isEditing ? 'cancel' : ''}`}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                  {isEditing && (
                    <button className="save-profile-btn" onClick={handleSave}>
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="profile-tabs">
              <button 
                className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                Personal Info
              </button>
              <button 
                className={`tab-btn ${activeTab === 'professional' ? 'active' : ''}`}
                onClick={() => setActiveTab('professional')}
              >
                Professional
              </button>
              <button 
                className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                Preferences
              </button>
            </div>

            {/* Profile Content */}
            <div className="profile-content">
              {activeTab === 'personal' && (
                <div className="profile-form">
                  <div className="form-section">
                    <h3>Personal Information</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Display Name</label>
                        <input
                          type="text"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your display name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={true}
                          className="disabled"
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your location"
                        />
                      </div>
                      <div className="form-group">
                        <label>Birthday</label>
                        <input
                          type="date"
                          name="birthday"
                          value={formData.birthday}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="form-group">
                        <label>Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>About Me</h3>
                    <div className="form-group">
                      <label>Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows="4"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="https://your-website.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="profile-form">
                  <div className="form-section">
                    <h3>Professional Information</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Job Title</label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your job title"
                        />
                      </div>
                      <div className="form-group">
                        <label>Company</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your company name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="profile-form">
                  <div className="form-section">
                    <h3>Account Preferences</h3>
                    <div className="preferences-grid">
                      <div className="preference-item">
                        <div className="preference-info">
                          <h4>Email Notifications</h4>
                          <p>Receive email updates about your account</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider"></span>
                        </label>
                      </div>
                      <div className="preference-item">
                        <div className="preference-info">
                          <h4>Push Notifications</h4>
                          <p>Get push notifications on your device</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider"></span>
                        </label>
                      </div>
                      <div className="preference-item">
                        <div className="preference-info">
                          <h4>Two-Factor Authentication</h4>
                          <p>Add an extra layer of security to your account</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 