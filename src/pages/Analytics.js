import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar } from '../components';
import '../Home.css';

const Analytics = () => {
  const [user, loading] = useAuthState(auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
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
        <p>Loading analytics...</p>
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

  // Mock data for analytics
  const analyticsData = {
    overview: {
      totalOrders: 156,
      totalRevenue: 12450,
      averageOrder: 79.8,
      customerSatisfaction: 4.8
    },
    trends: [
      { month: 'Jan', orders: 12, revenue: 950 },
      { month: 'Feb', orders: 15, revenue: 1200 },
      { month: 'Mar', orders: 18, revenue: 1450 },
      { month: 'Apr', orders: 22, revenue: 1800 },
      { month: 'May', orders: 25, revenue: 2100 },
      { month: 'Jun', orders: 28, revenue: 2400 },
      { month: 'Jul', orders: 32, revenue: 2750 }
    ],
    topProducts: [
      { name: 'Premium Widget', sales: 45, revenue: 2250 },
      { name: 'Deluxe Gadget', sales: 38, revenue: 1900 },
      { name: 'Standard Tool', sales: 32, revenue: 1280 },
      { name: 'Basic Kit', sales: 28, revenue: 840 }
    ]
  };

  const renderBarChart = (data, maxValue) => {
    return data.map((item, index) => (
      <div key={index} className="chart-bar-container">
        <div className="chart-bar" style={{ height: `${(item.revenue / maxValue) * 100}%` }}>
          <span className="chart-value">${item.revenue}</span>
        </div>
        <span className="chart-label">{item.month}</span>
      </div>
    ));
  };

  const maxRevenue = Math.max(...analyticsData.trends.map(item => item.revenue));

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
          activeTab="analytics"
          onItemClick={(id) => handleNavigation(id)}
        />

        <div className="content">
          <header className="content-header">
            <h1>📊 Analytics</h1>
            <p>Track your activities with insightful reports and metrics</p>
          </header>

          <div className="analytics-page">
            {/* Time Range Selector */}
            <div className="analytics-controls">
              <div className="time-range-selector">
                <button 
                  className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
                  onClick={() => setTimeRange('7d')}
                >
                  7 Days
                </button>
                <button 
                  className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
                  onClick={() => setTimeRange('30d')}
                >
                  30 Days
                </button>
                <button 
                  className={`time-btn ${timeRange === '90d' ? 'active' : ''}`}
                  onClick={() => setTimeRange('90d')}
                >
                  90 Days
                </button>
                <button 
                  className={`time-btn ${timeRange === '1y' ? 'active' : ''}`}
                  onClick={() => setTimeRange('1y')}
                >
                  1 Year
                </button>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="analytics-overview">
              <div className="overview-card">
                <div className="overview-icon">📦</div>
                <div className="overview-content">
                  <h3>Total Orders</h3>
                  <p className="overview-value">{analyticsData.overview.totalOrders}</p>
                  <span className="overview-change positive">+12% from last month</span>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-icon">💰</div>
                <div className="overview-content">
                  <h3>Total Revenue</h3>
                  <p className="overview-value">${analyticsData.overview.totalRevenue.toLocaleString()}</p>
                  <span className="overview-change positive">+8% from last month</span>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-icon">📈</div>
                <div className="overview-content">
                  <h3>Average Order</h3>
                  <p className="overview-value">${analyticsData.overview.averageOrder}</p>
                  <span className="overview-change positive">+5% from last month</span>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-icon">⭐</div>
                <div className="overview-content">
                  <h3>Satisfaction</h3>
                  <p className="overview-value">{analyticsData.overview.customerSatisfaction}/5</p>
                  <span className="overview-change positive">+0.2 from last month</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="analytics-charts">
              <div className="chart-container">
                <h3>Revenue Trends</h3>
                <div className="chart-wrapper">
                  <div className="chart-bars">
                    {renderBarChart(analyticsData.trends, maxRevenue)}
                  </div>
                </div>
              </div>

              <div className="chart-container">
                <h3>Top Products</h3>
                <div className="products-list">
                  {analyticsData.topProducts.map((product, index) => (
                    <div key={index} className="product-item">
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>{product.sales} units sold</p>
                      </div>
                      <div className="product-revenue">
                        ${product.revenue.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="analytics-metrics">
              <div className="metrics-card">
                <h3>Customer Insights</h3>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <span className="metric-label">New Customers</span>
                    <span className="metric-value">24</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Repeat Customers</span>
                    <span className="metric-value">89</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Customer Lifetime Value</span>
                    <span className="metric-value">$1,245</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Churn Rate</span>
                    <span className="metric-value">2.3%</span>
                  </div>
                </div>
              </div>

              <div className="metrics-card">
                <h3>Performance Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <span className="metric-label">Conversion Rate</span>
                    <span className="metric-value">3.2%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Average Session Duration</span>
                    <span className="metric-value">4m 32s</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Bounce Rate</span>
                    <span className="metric-value">28%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Page Views</span>
                    <span className="metric-value">1,234</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 