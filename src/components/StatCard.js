import React from 'react';

const StatCard = ({ title, value, change, changeType = 'neutral' }) => {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <p className="stat-number">{value}</p>
      <p className={`stat-change ${changeType}`}>{change}</p>
    </div>
  );
};

export default StatCard; 