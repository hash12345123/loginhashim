import React from 'react';

const ActivityItem = ({ icon, title, description, time }) => {
  return (
    <div className="activity-item">
      <div className="activity-icon">{icon}</div>
      <div className="activity-content">
        <h4>{title}</h4>
        <p>{description}</p>
        <span className="activity-time">{time}</span>
      </div>
    </div>
  );
};

export default ActivityItem; 