import React, { useState } from 'react';
import { Sparkles, X, AlertTriangle, CheckCircle, ShieldAlert, ChevronRight, Activity } from 'lucide-react';
import { PillChip } from './PillChip';
import { apiService } from '../services/api';

const SAMPLE_SYMPTOMS = [
  'Chest Pain', 'Headache', 'Shortness of Breath', 'Fever', 
  'Persistent Cough', 'Dizziness', 'Fatigue', 'Nausea', 
  'Abdominal Pain', 'Joint Tightness', 'Eye Strain', 'Palpitations'
];

export const AISymptomCheckerModal = ({ isOpen, onClose, onAssessmentComplete }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [duration, setDuration] = useState('1-2 Days');
  const [severity, setSeverity] = useState('Mild');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const toggleSymptom = (symp) => {
    if (selectedSymptoms.includes(symp)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symp));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symp]);
    }
  };

  const addCustomSymptom = () => {
    if (customInput.trim() && !selectedSymptoms.includes(customInput.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customInput.trim()]);
      setCustomInput('');
    }
  };

  const handleRunScan = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    try {
      const res = await apiService.analyzeSymptoms({
        symptoms: selectedSymptoms,
        duration,
        severity
      });
      setResult(res);
      setStep(2); // View AI report step
      if (onAssessmentComplete) onAssessmentComplete(res);
    } catch (err) {
      alert(err.message || 'AI Scan failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSelectedSymptoms([]);
    setCustomInput('');
    setResult(null);
    setStep(1);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(7, 13, 30, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', border: '1px solid rgba(163, 230, 53, 0.3)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(163, 230, 53, 0.15)', border: '1px solid #A3E635' }}>
              <Sparkles size={20} color="#A3E635" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>AI Symptom Triage Scanner</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Clinical AI Triage & Risk Matrix Engine</p>
            </div>
          </div>
          <button onClick={resetAndClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {step === 1 ? (
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '12px', color: 'var(--text-main)' }}>
              1. Select or Type Experienced Symptoms:
            </h4>
            
            {/* Symptom Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {SAMPLE_SYMPTOMS.map(symp => (
                <PillChip
                  key={symp}
                  label={symp}
                  active={selectedSymptoms.includes(symp)}
                  onClick={() => toggleSymptom(symp)}
                />
              ))}
            </div>

            {/* Custom Symptom Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <input
                type="text"
                className="input-glass"
                placeholder="Or type a specific symptom (e.g., Numbness in arm)..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomSymptom()}
              />
              <button onClick={addCustomSymptom} className="btn-glass" style={{ whiteSpace: 'nowrap' }}>
                Add
              </button>
            </div>

            {/* Severity & Duration Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Duration</label>
                <select value={duration} onChange={e => setDuration(e.target.value)} className="input-glass">
                  <option value="Less than 24 Hours">Less than 24 Hours</option>
                  <option value="1-2 Days">1-2 Days</option>
                  <option value="3-5 Days">3-5 Days</option>
                  <option value="1 Week+">1 Week+</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Perceived Severity</label>
                <select value={severity} onChange={e => setSeverity(e.target.value)} className="input-glass">
                  <option value="Mild">Mild (Noticeable but manageable)</option>
                  <option value="Moderate">Moderate (Interferes with work/sleep)</option>
                  <option value="Severe">Severe (Intense discomfort or distress)</option>
                </select>
              </div>
            </div>

            {/* Submit Trigger */}
            <button
              onClick={handleRunScan}
              disabled={selectedSymptoms.length === 0 || loading}
              className="btn-lime"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', opacity: selectedSymptoms.length === 0 ? 0.5 : 1 }}
            >
              {loading ? <Activity className="animate-pulse-glow" size={20} /> : <><Sparkles size={18} /> Execute AI Triage Analysis</>}
            </button>
          </div>
        ) : (
          /* Step 2: AI Scan Results */
          <div>
            <div style={{
              background: result?.triageLevel === 'emergency' || result?.triageLevel === 'high' 
                ? 'rgba(239, 68, 68, 0.15)' 
                : result?.triageLevel === 'medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(163, 230, 53, 0.15)',
              border: `1px solid ${
                result?.triageLevel === 'emergency' || result?.triageLevel === 'high' ? '#EF4444' : result?.triageLevel === 'medium' ? '#F59E0B' : '#A3E635'
              }`,
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                {result?.triageLevel === 'emergency' || result?.triageLevel === 'high' ? (
                  <ShieldAlert size={28} color="#EF4444" />
                ) : result?.triageLevel === 'medium' ? (
                  <AlertTriangle size={28} color="#F59E0B" />
                ) : (
                  <CheckCircle size={28} color="#A3E635" />
                )}
                <span style={{ fontSize: '1.4rem', fontWeight: '800', textTransform: 'uppercase', color: '#FFF' }}>
                  {result?.triageLevel} Priority Triage
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Risk Index Score: <strong style={{ color: '#FFF' }}>{result?.score} / 100</strong>
              </div>
            </div>

            {/* Analysis Box */}
            <div style={{ background: 'rgba(11, 19, 43, 0.6)', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border-glass)' }}>
              <h5 style={{ fontSize: '0.85rem', color: '#A3E635', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>AI Clinical Summary</h5>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.5' }}>{result?.analysis}</p>
            </div>

            {/* Recommendations */}
            <div style={{ marginBottom: '24px' }}>
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>Recommended Next Steps</h5>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {result?.recommendedActions.map((rec, i) => (
                  <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{rec}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} className="btn-glass" style={{ flex: 1, justifyContent: 'center' }}>
                Scan Again
              </button>
              <button onClick={resetAndClose} className="btn-lime" style={{ flex: 1, justifyContent: 'center' }}>
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
