import React from 'react';

const DashboardCard = ({ card, onClick }) => {
  return (
    <div 
      className="card" 
      onClick={() => onClick(card.id)}
      style={{ borderLeft: `4px solid ${card.color}` }}
    >
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      <div className="card-arrow">→</div>
    </div>
  );
};

export default DashboardCard; 