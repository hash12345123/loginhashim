import React from 'react';

const SidebarItem = ({ item, isActive, onClick }) => {
  return (
    <li 
      className={isActive ? 'active' : ''}
      onClick={() => onClick(item.id)}
    >
      <span className="nav-icon">{item.icon}</span>
      <span className="nav-label">{item.label}</span>
    </li>
  );
};

export default SidebarItem; 