import React from 'react';
import { GlassCard } from './GlassCard';

export const StatCard = ({ title, value, unit = '', status = 'Normal', icon: Icon, trend = '', onClick, active = false }) => {
  const getBadgeStyle = () => {
    switch (status.toLowerCase()) {
      case 'high risk':
      case 'emergency':
      case 'severe':
        return { bg: 'rgba(239, 68, 68, 0.2)', border: '#EF4444', text: '#FCA5A5' };
      case 'elevated':
      case 'medium':
      case 'moderate':
        return { bg: 'rgba(245, 158, 11, 0.2)', border: '#F59E0B', text: '#FCD34D' };
      default:
        return { bg: 'rgba(163, 230, 53, 0.15)', border: '#A3E635', text: '#A3E635' };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <GlassCard
      interactive
      onClick={onClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        border: active ? '1px solid #A3E635' : undefined,
        boxShadow: active ? '0 0 18px rgba(163, 230, 53, 0.3)' : undefined,
        background: active ? 'rgba(22, 33, 62, 0.95)' : undefined,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '0.85rem', color: active ? '#A3E635' : 'var(--text-muted)', fontWeight: '700' }}>{title}</span>
        {Icon && (
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: active ? 'rgba(163, 230, 53, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${active ? '#A3E635' : 'var(--border-glass)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={20} color={active ? '#A3E635' : '#A3E635'} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{value}</span>
        {unit && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>{unit}</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: '700',
          padding: '3px 10px',
          borderRadius: 'var(--radius-pill)',
          background: badgeStyle.bg,
          border: `1px solid ${badgeStyle.border}`,
          color: badgeStyle.text,
          textTransform: 'uppercase'
        }}>
          {status}
        </span>
        {trend && <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{trend}</span>}
      </div>
    </GlassCard>
  );
};

