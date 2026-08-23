import React from 'react';

export const GlassCard = ({ children, className = '', interactive = false, style = {}, ...props }) => {
  return (
    <div
      className={`glass-panel ${interactive ? 'glass-panel-interactive' : ''} ${className}`}
      style={{ padding: '24px', ...style }}
      {...props}
    >
      {children}
    </div>
  );
};
