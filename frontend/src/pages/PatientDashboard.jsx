import React, { useState, useEffect } from 'react';
import { Heart, Activity, Droplet, Moon, Footprints, Calendar, Sparkles, Plus, FileText, Pill, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { GlassCard } from '../components/GlassCard';
import { StatCard } from '../components/StatCard';
import { VitalsChart } from '../components/VitalsChart';
import { PillChip } from '../components/PillChip';

export const PatientDashboard = ({ onOpenSymptomChecker, onOpenBooking }) => {
  const { user } = useAuth();

  const [vitals, setVitals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [symptomChecks, setSymptomChecks] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState('heartRate');
  const [apptFilter, setApptFilter] = useState('all'); // 'all', 'scheduled', 'completed', 'cancelled'

  const handleCancelAppointment = async (apptId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await apiService.updateAppointmentStatus(apptId, 'cancelled');
        fetchPatientData();
      } catch (err) {
        alert(err.message || 'Failed to cancel appointment.');
      }
    }
  };

  const filteredAppointments = appointments.filter(a => {
    if (apptFilter === 'all') return true;
    return a.status === apptFilter;
  });

  // Quick Vitals Entry Modal state
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [newHr, setNewHr] = useState('76');
  const [newSys, setNewSys] = useState('120');
  const [newDia, setNewDia] = useState('80');
  const [newGlucose, setNewGlucose] = useState('98');
  const [newO2, setNewO2] = useState('99');
  const [submittingVital, setSubmittingVital] = useState(false);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const [vitalsData, apptsData, symptomsData, rxData] = await Promise.all([
        apiService.getVitals(),
        apiService.getAppointments(),
        apiService.getSymptomChecks(),
        apiService.getPrescriptions()
      ]);
      setVitals(vitalsData);
      setAppointments(apptsData);
      setSymptomChecks(symptomsData);
      setPrescriptions(rxData);
    } catch (err) {
      console.error('Fetch patient data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const handleAddVital = async (e) => {
    e.preventDefault();
    setSubmittingVital(true);
    try {
      await apiService.addVitals({
        heartRate: Number(newHr),
        bloodPressureSys: Number(newSys),
        bloodPressureDia: Number(newDia),
        bloodGlucose: Number(newGlucose),
        oxygenLevel: Number(newO2)
      });
      setShowVitalsModal(false);
      fetchPatientData();
    } catch (err) {
      alert(err.message || 'Failed to submit vital reading.');
    } finally {
      setSubmittingVital(false);
    }
  };

  const latestVital = vitals.length > 0 ? vitals[0] : {
    heartRate: 72,
    bloodPressureSys: 118,
    bloodPressureDia: 76,
    bloodGlucose: 95,
    oxygenLevel: 99,
    steps: 8420,
    sleepHours: 7.5,
    status: 'Normal'
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 28px 60px 28px' }}>
      
      {/* Patient Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(17, 28, 68, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(163, 230, 53, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFF' }}>
                Welcome back, {user?.name}
              </h2>
              <span style={{ background: 'rgba(163, 230, 53, 0.2)', border: '1px solid #A3E635', color: '#A3E635', fontSize: '0.75rem', fontWeight: '700', padding: '2px 10px', borderRadius: 'var(--radius-pill)' }}>
                Patient ID: #{user?._id?.slice(-6) || '84291'}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Clinical Vitals Summary • Continuous Health Analytics Monitoring
            </p>
          </div>

          {/* Quick Profile Badges */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', padding: '8px 16px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Blood Group</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#A3E635' }}>{user?.bloodType || 'A+'}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', padding: '8px 16px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Age / Gender</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#FFF' }}>{user?.age || 34} yrs • {user?.gender || 'Female'}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', padding: '8px 16px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Allergies</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#FCA5A5' }}>
                {user?.allergies?.length > 0 ? user.allergies.join(', ') : 'Penicillin, Peanuts'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals Quick Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        <StatCard
          title="Heart Rate"
          value={latestVital.heartRate}
          unit="bpm"
          status={latestVital.status}
          icon={Heart}
          trend="Click for HR Chart →"
          onClick={() => setChartMetric('heartRate')}
          active={chartMetric === 'heartRate'}
        />
        <StatCard
          title="Blood Pressure"
          value={`${latestVital.bloodPressureSys}/${latestVital.bloodPressureDia}`}
          unit="mmHg"
          status={latestVital.bloodPressureSys > 130 ? 'Elevated' : 'Normal'}
          icon={Activity}
          trend="Click for BP Chart →"
          onClick={() => setChartMetric('bloodPressure')}
          active={chartMetric === 'bloodPressure'}
        />
        <StatCard
          title="Blood Glucose"
          value={latestVital.bloodGlucose}
          unit="mg/dL"
          status={latestVital.bloodGlucose > 120 ? 'Elevated' : 'Normal'}
          icon={Droplet}
          trend="Click for Glucose Chart →"
          onClick={() => setChartMetric('glucose')}
          active={chartMetric === 'glucose'}
        />
        <StatCard
          title="Oxygen Saturation"
          value={`${latestVital.oxygenLevel}%`}
          unit="SpO2"
          status="Normal"
          icon={ShieldCheck}
          trend="Click for SpO2 Chart →"
          onClick={() => setChartMetric('oxygen')}
          active={chartMetric === 'oxygen'}
        />
        <StatCard
          title="Resting Sleep"
          value={latestVital.sleepHours || 7.5}
          unit="hrs"
          status="Normal"
          icon={Moon}
          trend="Optimal Rest"
        />
        <StatCard
          title="Daily Activity"
          value={latestVital.steps ? latestVital.steps.toLocaleString() : '8,420'}
          unit="steps"
          status="Active"
          icon={Footprints}
          trend="Goal Achieved"
        />
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px', marginBottom: '28px' }}>
        
        {/* Left Column: Interactive Vitals Chart */}
        <div>
          <GlassCard style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Biometric Telemetry & Trends</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Historical patient vital indicators timeline</p>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <PillChip label="Heart Rate" active={chartMetric === 'heartRate'} onClick={() => setChartMetric('heartRate')} />
                <PillChip label="Blood Pressure" active={chartMetric === 'bloodPressure'} onClick={() => setChartMetric('bloodPressure')} />
                <PillChip label="Glucose" active={chartMetric === 'glucose'} onClick={() => setChartMetric('glucose')} />
                <PillChip label="Oxygen SpO2" active={chartMetric === 'oxygen'} onClick={() => setChartMetric('oxygen')} />
              </div>
            </div>

            <VitalsChart vitalsData={vitals} activeMetric={chartMetric} />

            <div style={{ marginTop: '18px', textAlign: 'right' }}>
              <button onClick={() => setShowVitalsModal(true)} className="btn-lime" style={{ fontSize: '0.85rem' }}>
                <Plus size={16} /> Log New Vitals Reading
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Scheduled Consultations Hub */}
        <div>
          <GlassCard style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="#A3E635" /> Consultations & Appointments
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Manage doctor visits & schedules</p>
              </div>

              <button onClick={onOpenBooking} className="btn-lime" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                <Plus size={15} /> Book Visit
              </button>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <PillChip label="All" active={apptFilter === 'all'} onClick={() => setApptFilter('all')} count={appointments.length} />
              <PillChip label="Scheduled" active={apptFilter === 'scheduled'} onClick={() => setApptFilter('scheduled')} count={appointments.filter(a => a.status === 'scheduled').length} />
              <PillChip label="Completed" active={apptFilter === 'completed'} onClick={() => setApptFilter('completed')} count={appointments.filter(a => a.status === 'completed').length} />
              <PillChip label="Cancelled" active={apptFilter === 'cancelled'} onClick={() => setApptFilter('cancelled')} count={appointments.filter(a => a.status === 'cancelled').length} />
            </div>

            {/* Appointment List */}
            {filteredAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '35px 10px', color: 'var(--text-muted)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={32} color="#64748B" style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem' }}>No {apptFilter !== 'all' ? apptFilter : ''} appointments found.</p>
                <button onClick={onOpenBooking} className="btn-glass" style={{ marginTop: '12px', fontSize: '0.8rem' }}>
                  Book your first visit
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                {filteredAppointments.map((appt) => (
                  <div key={appt._id} style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '16px', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#FFF', display: 'block' }}>{appt.doctorName}</span>
                        <span style={{ fontSize: '0.8rem', color: '#A3E635', fontWeight: '600' }}>{appt.specialty}</span>
                      </div>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-pill)',
                        background: appt.status === 'scheduled' ? 'rgba(163, 230, 53, 0.2)' : appt.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: appt.status === 'scheduled' ? '#A3E635' : appt.status === 'completed' ? '#10B981' : '#FCA5A5',
                        border: `1px solid ${appt.status === 'scheduled' ? '#A3E635' : appt.status === 'completed' ? '#10B981' : '#EF4444'}`,
                        textTransform: 'uppercase',
                        fontWeight: '700'
                      }}>
                        {appt.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 0, 0, 0.3)', padding: '4px 10px', borderRadius: '8px' }}>
                        <Clock size={14} color="#A3E635" /> {appt.date} at {appt.timeSlot}
                      </div>
                    </div>

                    {appt.reason && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '12px', background: 'rgba(11, 19, 43, 0.5)', padding: '8px 12px', borderRadius: '8px' }}>
                        Reason: {appt.reason}
                      </p>
                    )}

                    {appt.status === 'scheduled' && (
                      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-glass)', paddingTop: '10px' }}>
                        <button onClick={onOpenBooking} className="btn-glass" style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', padding: '6px 10px' }}>
                          Reschedule
                        </button>
                        <button onClick={() => handleCancelAppointment(appt._id)} className="btn-danger" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

      </div>

      {/* Lower Row: AI Symptom Checks & Active Prescriptions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
        
        {/* AI Symptom Log */}
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#A3E635" /> AI Clinical Triage Log
            </h3>
            <button onClick={onOpenSymptomChecker} className="btn-lime" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              New Scan
            </button>
          </div>

          {symptomChecks.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '20px 0' }}>No AI symptom scans logged yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {symptomChecks.slice(0, 3).map((check) => (
                <div key={check._id} style={{ background: 'rgba(11, 19, 43, 0.6)', border: '1px solid var(--border-glass)', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {check.symptoms.map((s, i) => (
                        <span key={i} style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#FFF', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>{s}</span>
                      ))}
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: check.triageLevel === 'emergency' || check.triageLevel === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(163, 230, 53, 0.2)',
                      color: check.triageLevel === 'emergency' || check.triageLevel === 'high' ? '#FCA5A5' : '#A3E635',
                      textTransform: 'uppercase'
                    }}>
                      {check.triageLevel} Triage
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{check.analysis}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Prescriptions Hub */}
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Pill size={18} color="#A3E635" /> Prescriptions & Medications
            </h3>
          </div>

          {prescriptions.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '20px 0' }}>No active prescriptions on record.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {prescriptions.map((rx) => (
                <div key={rx._id} style={{ background: 'rgba(11, 19, 43, 0.6)', border: '1px solid var(--border-glass)', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#FFF' }}>{rx.medication} <span style={{ color: '#A3E635', fontSize: '0.85rem' }}>({rx.dosage})</span></div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{rx.frequency} • Prescribed by {rx.prescribingDoctor}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(163, 230, 53, 0.15)', border: '1px solid #A3E635', color: '#A3E635', padding: '3px 8px', borderRadius: '10px' }}>
                      {rx.refillsLeft} Refills Remaining
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

      </div>

      {/* Add Vitals Quick Dialog Modal */}
      {showVitalsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(7, 13, 30, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px', border: '1px solid #A3E635' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Log Biometric Vitals</h3>
            <form onSubmit={handleAddVital} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Heart Rate (BPM)</label>
                <input type="number" className="input-glass" value={newHr} onChange={e => setNewHr(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Systolic BP (mmHg)</label>
                  <input type="number" className="input-glass" value={newSys} onChange={e => setNewSys(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Diastolic BP (mmHg)</label>
                  <input type="number" className="input-glass" value={newDia} onChange={e => setNewDia(e.target.value)} required />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Blood Glucose (mg/dL)</label>
                <input type="number" className="input-glass" value={newGlucose} onChange={e => setNewGlucose(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Oxygen Saturation SpO2 (%)</label>
                <input type="number" className="input-glass" value={newO2} onChange={e => setNewO2(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowVitalsModal(false)} className="btn-glass" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" disabled={submittingVital} className="btn-lime" style={{ flex: 1, justifyContent: 'center' }}>Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
