import React from 'react';
import UserProfile from './UserProfile';
import SidebarItem from './SidebarItem';

const Sidebar = ({ 
  isCollapsed, 
  isMobile, 
  userName, 
  userEmail, 
  sidebarItems, 
  activeTab, 
  onItemClick 
}) => {
  return (
    <div className={`sidebar ${!isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile-sidebar' : ''}`}>
      <UserProfile userName={userName} userEmail={userEmail} />
      
      <nav className="sidebar-nav">
        <ul>
          {sidebarItems.map((item) => (
            <SidebarItem 
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={onItemClick}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 