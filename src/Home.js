import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { DashboardCard, StatCard, ActivityItem, SidebarItem, Navbar, Sidebar } from "./components";
import "./Home.css";

const Home = () => {
  const [user, loading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check if screen is mobile/tablet on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileOrTablet = window.innerWidth < 1024; // Include tablets (768px-1024px)
      setIsMobile(isMobileOrTablet);
      // On mobile/tablet, sidebar starts hidden (collapsed = true means hidden)
      // On desktop (1024px+), sidebar starts visible (collapsed = false means visible)
      if (isMobileOrTablet) {
        setSidebarCollapsed(true); // Hidden by default on mobile/tablet
      } else {
        setSidebarCollapsed(false); // Visible by default on desktop
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
        <p>Loading your dashboard...</p>
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
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarCollapsed(true); // Hide sidebar on mobile after navigation
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarCollapsed(true); // Hide sidebar on mobile
    }
  };

  const dashboardCards = [
    {
      id: "profile",
      title: "👤 Profile",
      description: "View and update your personal information",
      color: "#4CAF50"
    },
    {
      id: "settings",
      title: "⚙️ Settings",
      description: "Customize your preferences and account settings",
      color: "#2196F3"
    },
    {
      id: "analytics",
      title: "📊 Analytics",
      description: "Track your activities with insightful reports",
      color: "#FF9800"
    },
    {
      id: "messages",
      title: "💬 Messages",
      description: "Check your inbox and notifications",
      color: "#9C27B0"
    },
    {
      id: "documents",
      title: "📄 Documents",
      description: "Access and manage your files",
      color: "#607D8B"
    },
    {
      id: "logout",
      title: "🚪 Logout",
      description: "Securely exit your account",
      color: "#F44336"
    }
  ];

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
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${!sidebarCollapsed && isMobile ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* Top Navigation Bar */}
      <Navbar 
        onToggleSidebar={toggleSidebar}
        userName={userName}
        onLogout={handleLogout}
      />

      <div className="main-content">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          userName={userName}
          userEmail={user.email}
          sidebarItems={sidebarItems}
          activeTab={activeTab}
          onItemClick={(id) => {
            setActiveTab(id);
            handleNavigation(id);
          }}
        />

        {/* Main Content Area */}
        <div className="content">
          {/* <header className="content-header">
            <h1>Welcome Back, {userName}! 👋</h1>
            <p>Here's what's happening with your account today.</p>
          </header> */}

          {/* Dashboard Cards */}
          <div className="cards-container">
            {dashboardCards.map((card) => (
              <DashboardCard 
                key={card.id}
                card={card}
                onClick={handleNavigation}
              />
            ))}
          </div>

          {/* Quick Stats Section */}
          <div className="stats-section">
            <h2>Quick Stats</h2>
            <div className="stats-grid">
              <StatCard 
                title="📊 Total Orders"
                value="24"
                change="+12% this month"
                changeType="positive"
              />
              <StatCard 
                title="💰 Total Spent"
                value="$1,234"
                change="+8% this month"
                changeType="positive"
              />
              <StatCard 
                title="🎁 Rewards Points"
                value="1,250"
                change="+15% this month"
                changeType="positive"
              />
              <StatCard 
                title="⭐ Average Rating"
                value="4.8"
                change="No change"
                changeType="neutral"
              />
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <ActivityItem 
                icon="🛒"
                title="Order #12345 placed"
                description="You placed an order for $89.99"
                time="2 hours ago"
              />
              <ActivityItem 
                icon="🎁"
                title="Rewards points earned"
                description="You earned 50 points for your purchase"
                time="1 day ago"
              />
              <ActivityItem 
                icon="📧"
                title="Profile updated"
                description="You updated your contact information"
                time="3 days ago"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;