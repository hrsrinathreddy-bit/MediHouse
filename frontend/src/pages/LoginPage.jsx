import React, { useState } from 'react';
import { HeartPulse, Sparkles, ShieldCheck, UserCheck, ArrowRight, Lock, Mail, User, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';

export const LoginPage = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient');
  const [age, setAge] = useState('34');
  const [gender, setGender] = useState('Female');
  const [bloodType, setBloodType] = useState('A+');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password, role, age: Number(age), gender, bloodType });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoPatient = () => {
    setEmail('patient@medicare.ai');
    setPassword('password123');
    setIsRegister(false);
  };

  const fillDemoAdmin = () => {
    setEmail('admin@medicare.ai');
    setPassword('password123');
    setIsRegister(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Brand Banner */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.25), rgba(16, 185, 129, 0.35))',
            border: '1px solid rgba(163, 230, 53, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 0 25px rgba(163, 230, 53, 0.3)'
          }}>
            <HeartPulse size={36} color="#A3E635" className="animate-pulse-glow" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #FFFFFF 0%, #A3E635 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MediCare AI
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Next-Gen Health Intelligence & Clinical Triage
          </p>
        </div>

        {/* Quick Demo Credentials Widget */}
        <div style={{
          background: 'rgba(163, 230, 53, 0.08)',
          border: '1px solid rgba(163, 230, 53, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#A3E635', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> 1-Click Demo Quick Logins
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={fillDemoPatient} className="btn-lime" style={{ flex: 1, padding: '6px 12px', fontSize: '0.78rem', justifyContent: 'center' }}>
              <UserCheck size={14} /> Patient Demo
            </button>
            <button onClick={fillDemoAdmin} className="btn-glass" style={{ flex: 1, padding: '6px 12px', fontSize: '0.78rem', justifyContent: 'center', borderColor: '#38BDF8', color: '#38BDF8' }}>
              <ShieldCheck size={14} color="#38BDF8" /> Admin Demo
            </button>
          </div>
        </div>

        {/* Main Card */}
        <GlassCard>
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {isRegister && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                    <input
                      type="text"
                      className="input-glass"
                      placeholder="Sarah Jenkins"
                      style={{ paddingLeft: '40px' }}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Role</label>
                    <select value={role} onChange={e => setRole(e.target.value)} className="input-glass">
                      <option value="patient">Patient</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Blood Type</label>
                    <select value={bloodType} onChange={e => setBloodType(e.target.value)} className="input-glass">
                      <option value="A+">A+</option>
                      <option value="O-">O-</option>
                      <option value="B+">B+</option>
                      <option value="AB+">AB+</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                <input
                  type="email"
                  className="input-glass"
                  placeholder="name@medicare.ai"
                  style={{ paddingLeft: '40px' }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                <input
                  type="password"
                  className="input-glass"
                  placeholder="••••••••"
                  style={{ paddingLeft: '40px' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-lime" style={{ marginTop: '8px', padding: '14px', justifyContent: 'center', fontSize: '0.95rem' }}>
              {loading ? <Activity className="animate-pulse-glow" size={20} /> : <>{isRegister ? 'Create Account' : 'Sign In to Portal'} <ArrowRight size={18} /></>}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
            <button
              onClick={() => setIsRegister(!isRegister)}
              style={{ background: 'transparent', border: 'none', color: '#A3E635', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}
            >
              {isRegister ? 'Already registered? Sign In' : 'New patient? Register digital account'}
            </button>
          </div>

        </GlassCard>

      </div>
    </div>
  );
};
