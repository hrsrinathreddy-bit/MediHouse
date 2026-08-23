import React from 'react';

export const PillChip = ({ label, active = false, icon: Icon, onClick, count }) => {
  return (
    <button
      type="button"
      className={`pill-chip ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {Icon && <Icon size={14} />}
      <span>{label}</span>
      {count !== undefined && (
        <span style={{ 
          fontSize: '0.7rem', 
          background: active ? '#070D1E' : 'rgba(255, 255, 255, 0.1)', 
          color: active ? '#A3E635' : '#94A3B8', 
          padding: '1px 6px', 
          borderRadius: '10px' 
        }}>
          {count}
        </span>
      )}
    </button>
  );
};
