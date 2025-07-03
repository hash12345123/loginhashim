import React from 'react';

const UserProfile = ({ userName, userEmail }) => {
  return (
    <div className="profile-section">
      <div className="user-avatar">
        {userName.charAt(0).toUpperCase()}
      </div>
      <h3>{userName}</h3>
      <p className="user-email">{userEmail}</p>
    </div>
  );
};

export default UserProfile; 