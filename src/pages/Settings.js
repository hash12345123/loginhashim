import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar } from '../components';
import '../Home.css';

const Settings = () => {
  const [user, loading] = useAuthState(auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    twoFactorAuth: false,
    darkMode: false,
    autoSave: true,
    language: 'en',
    timezone: 'UTC',
    currency: 'USD'
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
        <p>Loading settings...</p>
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

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSelectChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
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
          activeTab="settings"
          onItemClick={(id) => handleNavigation(id)}
        />

        <div className="content">
          <header className="content-header">
            <h1>⚙️ Settings</h1>
            <p>Customize your preferences and account settings</p>
          </header>

          <div className="settings-page">
            {/* Settings Tabs */}
            <div className="settings-tabs">
              <button 
                className={`settings-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                General
              </button>
              <button 
                className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications
              </button>
              <button 
                className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
              <button 
                className={`settings-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
                onClick={() => setActiveTab('privacy')}
              >
                Privacy
              </button>
            </div>

            {/* Settings Content */}
            <div className="settings-content">
              {activeTab === 'general' && (
                <div className="settings-section">
                  <h3>General Preferences</h3>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Dark Mode</h4>
                        <p>Switch to dark theme for better viewing in low light</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.darkMode}
                          onChange={() => handleSettingChange('darkMode')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Auto Save</h4>
                        <p>Automatically save your changes</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.autoSave}
                          onChange={() => handleSettingChange('autoSave')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Language</h4>
                        <p>Choose your preferred language</p>
                      </div>
                      <select 
                        value={settings.language}
                        onChange={(e) => handleSelectChange('language', e.target.value)}
                        className="settings-select"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                      </select>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Timezone</h4>
                        <p>Set your local timezone</p>
                      </div>
                      <select 
                        value={settings.timezone}
                        onChange={(e) => handleSelectChange('timezone', e.target.value)}
                        className="settings-select"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="GMT">GMT</option>
                        <option value="CET">Central European Time</option>
                      </select>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Currency</h4>
                        <p>Select your preferred currency</p>
                      </div>
                      <select 
                        value={settings.currency}
                        onChange={(e) => handleSelectChange('currency', e.target.value)}
                        className="settings-select"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="CAD">CAD (C$)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <h3>Notification Preferences</h3>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Email Notifications</h4>
                        <p>Receive important updates via email</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.emailNotifications}
                          onChange={() => handleSettingChange('emailNotifications')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Push Notifications</h4>
                        <p>Get instant notifications on your device</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.pushNotifications}
                          onChange={() => handleSettingChange('pushNotifications')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Order Updates</h4>
                        <p>Get notified about your order status</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Promotional Emails</h4>
                        <p>Receive special offers and promotions</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="settings-section">
                  <h3>Security Settings</h3>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.twoFactorAuth}
                          onChange={() => handleSettingChange('twoFactorAuth')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Login Alerts</h4>
                        <p>Get notified of new login attempts</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Session Management</h4>
                        <p>Manage your active sessions</p>
                      </div>
                      <button className="settings-btn">View Sessions</button>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Password Change</h4>
                        <p>Update your account password</p>
                      </div>
                      <button className="settings-btn">Change Password</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="settings-section">
                  <h3>Privacy Settings</h3>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Profile Visibility</h4>
                        <p>Control who can see your profile information</p>
                      </div>
                      <select className="settings-select">
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Data Collection</h4>
                        <p>Allow us to collect usage data for improvements</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Third-Party Sharing</h4>
                        <p>Share data with trusted third-party services</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Data Export</h4>
                        <p>Download your personal data</p>
                      </div>
                      <button className="settings-btn">Export Data</button>
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

export default Settings; 