import React from 'react';
import { ShieldCheck, UserCheck, LogOut, HeartPulse, Sparkles, Stethoscope, LayoutDashboard, Flower2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenSymptomChecker, currentView = 'dashboard', onChangeView }) => {
  const { user, logout } = useAuth();

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '14px 28px', sticky: 'top', zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left: Brand Logo */}
        <div
          onClick={() => onChangeView && onChangeView('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.2), rgba(16, 185, 129, 0.3))', 
            border: '1px solid rgba(163, 230, 53, 0.4)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(163, 230, 53, 0.25)'
          }}>
            <HeartPulse size={24} color="#A3E635" className="animate-pulse-glow" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #FFFFFF 0%, #A3E635 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MediCare <span style={{ fontSize: '0.8rem', verticalAlign: 'super', border: '1px solid #A3E635', padding: '2px 6px', borderRadius: '10px', color: '#A3E635', WebkitTextFillColor: '#A3E635' }}>AI</span>
            </h1>
            <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>Clinical Intelligence Platform</p>
          </div>
        </div>

        {/* Center: Navigation View Switcher */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '5px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-glass)', flexWrap: 'wrap' }}>
          <button
            onClick={() => onChangeView && onChangeView('dashboard')}
            style={{
              background: currentView === 'dashboard' ? '#A3E635' : 'transparent',
              color: currentView === 'dashboard' ? '#070D1E' : '#FFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.82rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: currentView === 'dashboard' ? '0 0 15px rgba(163, 230, 53, 0.3)' : 'none'
            }}
          >
            <LayoutDashboard size={15} /> Clinical Dashboard
          </button>
          <button
            onClick={() => onChangeView && onChangeView('doctors')}
            style={{
              background: currentView === 'doctors' ? '#A3E635' : 'transparent',
              color: currentView === 'doctors' ? '#070D1E' : '#FFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.82rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: currentView === 'doctors' ? '0 0 15px rgba(163, 230, 53, 0.3)' : 'none'
            }}
          >
            <Stethoscope size={15} /> Doctors Roster
          </button>
          <button
            onClick={() => onChangeView && onChangeView('wellness')}
            style={{
              background: currentView === 'wellness' ? '#10B981' : 'transparent',
              color: currentView === 'wellness' ? '#070D1E' : '#FFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.82rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: currentView === 'wellness' ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            <Flower2 size={15} /> Wellness & Yoga Hub
          </button>
        </div>

        {/* Right: Actions & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {user?.role === 'patient' && (
            <button onClick={onOpenSymptomChecker} className="btn-lime" style={{ fontSize: '0.86rem', padding: '8px 18px' }}>
              <Sparkles size={16} /> AI Symptom Scan
            </button>
          )}

          {/* User Profile Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.04)', padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-glass)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: user?.role === 'admin' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(163, 230, 53, 0.2)', border: `1px solid ${user?.role === 'admin' ? '#38BDF8' : '#A3E635'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.role === 'admin' ? <ShieldCheck size={18} color="#38BDF8" /> : <UserCheck size={18} color="#A3E635" />}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: user?.role === 'admin' ? '#38BDF8' : '#A3E635', fontWeight: '600', textTransform: 'uppercase' }}>
                {user?.role === 'admin' ? 'Medical Admin' : 'Patient Portal'}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button onClick={logout} title="Sign Out" className="btn-glass" style={{ padding: '8px 12px', borderRadius: '50%' }}>
            <LogOut size={18} color="#EF4444" />
          </button>
        </div>

      </div>
    </header>
  );
};
