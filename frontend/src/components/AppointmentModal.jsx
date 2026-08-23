import React, { useState, useEffect } from 'react';
import { Calendar, X, Clock, Video, Building2, Star, CheckCircle2, ShieldCheck, UserCheck, Stethoscope, Sparkles, Lock } from 'lucide-react';
import { PillChip } from './PillChip';
import { apiService } from '../services/api';

const DOCTORS = [
  {
    name: 'Dr. Marcus Chen, MD',
    title: 'Chief Senior Cardiologist',
    specialty: 'Cardiology & Cardiovascular Surgery',
    fee: '$150',
    rating: '4.9 ★',
    exp: '14 yrs exp',
    hospital: 'Johns Hopkins Medical Center',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    color: '#A3E635'
  },
  {
    name: 'Dr. Emily Carter, MD',
    title: 'Primary Care Director',
    specialty: 'General Practice & Internal Medicine',
    fee: '$95',
    rating: '5.0 ★',
    exp: '10 yrs exp',
    hospital: 'Stanford Health Care Institute',
    photo: 'https://images.unsplash.com/photo-1594824813566-82823d5afe4a?auto=format&fit=crop&w=400&q=80',
    color: '#38BDF8'
  },
  {
    name: 'Dr. Aris Thorne, MD, PhD',
    title: 'Director of Neurology Institute',
    specialty: 'Clinical Neurology & Brain Health',
    fee: '$175',
    rating: '4.8 ★',
    exp: '18 yrs exp',
    hospital: 'Mayo Clinic Health Network',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    color: '#F59E0B'
  },
  {
    name: 'Dr. Sophia Sterling, MD',
    title: 'Head of Endocrinology',
    specialty: 'Endocrinology & Diabetic Management',
    fee: '$130',
    rating: '4.9 ★',
    exp: '12 yrs exp',
    hospital: 'Columbia University Medical Network',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    color: '#10B981'
  },
  {
    name: 'Dr. Julian Vance, MD',
    title: 'Senior Clinical Dermatologist',
    specialty: 'Dermatology & Oncology',
    fee: '$120',
    rating: '4.9 ★',
    exp: '9 yrs exp',
    hospital: 'Yale New Haven Hospital Network',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    color: '#EC4899'
  },
  {
    name: 'Dr. Maya Lin, MD',
    title: 'Metabolic & Longevity Specialist',
    specialty: 'Integrative Wellness & Longevity',
    fee: '$140',
    rating: '5.0 ★',
    exp: '11 yrs exp',
    hospital: 'UCLA Medical Center',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    color: '#8B5CF6'
  }
];

const TIME_SLOTS = [
  { slot: '09:00 AM', period: 'Morning' },
  { slot: '10:30 AM', period: 'Morning' },
  { slot: '01:15 PM', period: 'Afternoon' },
  { slot: '02:45 PM', period: 'Afternoon' },
  { slot: '04:15 PM', period: 'Evening' },
  { slot: '05:30 PM', period: 'Evening' }
];

const REASON_PRESETS = [
  'Routine Wellness Check',
  'Lab Results Review',
  'Cardiology & BP Check',
  'Prescription Refill',
  'AI Triage Follow-up'
];

export const AppointmentModal = ({ isOpen, onClose, onAppointmentBooked, initialDoctor = null }) => {
  if (!isOpen) return null;

  // Generate next 10 days for calendar pill selector
  const today = new Date();
  const calendarDays = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return {
      iso: d.toISOString().split('T')[0],
      displayDay: d.toLocaleDateString('en-US', { weekday: 'short' }),
      displayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  const getMatchedDoctor = (initDoc) => {
    if (!initDoc) return DOCTORS[0];
    const initName = (initDoc.name || '').toLowerCase();
    const match = DOCTORS.find(d => 
      d.name.toLowerCase().includes(initName) || 
      initName.includes(d.name.toLowerCase())
    );
    if (match) return { ...match, ...initDoc };
    return {
      name: initDoc.name || 'Dr. Specialist',
      title: initDoc.title || 'Medical Specialist',
      specialty: initDoc.specialty || 'General Care',
      rating: initDoc.rating || '4.9 ★',
      hospital: initDoc.hospital || 'MediCare AI Center',
      photo: initDoc.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
    };
  };

  const [selectedDoctor, setSelectedDoctor] = useState(() => getMatchedDoctor(initialDoctor));
  const [showDoctorPicker, setShowDoctorPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(calendarDays[0].iso);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1].slot);
  const [consultationType, setConsultationType] = useState('telehealth'); // 'telehealth' or 'in-person'
  const [reason, setReason] = useState('');
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Details, 2: Review & Confirm

  useEffect(() => {
    if (initialDoctor) {
      setSelectedDoctor(getMatchedDoctor(initialDoctor));
    }
  }, [initialDoctor]);

  useEffect(() => {
    if (isOpen) {
      apiService.getAppointments()
        .then(res => setExistingAppointments(res || []))
        .catch(err => console.error('Failed to fetch existing appointments:', err));
    }
  }, [isOpen]);

  // Check if slot is already appointed for another patient on the selected date
  const isSlotBookedForOthers = (slotTime) => {
    // 1. Check real database appointments for this doctor & date
    const match = existingAppointments.find(a => {
      const docName = (selectedDoctor.name || '').toLowerCase();
      const aDocName = (a.doctorName || '').toLowerCase();
      const isSameDoctor = aDocName.includes(docName) || docName.includes(aDocName);
      return isSameDoctor && a.date === selectedDate && a.timeSlot === slotTime && a.status !== 'cancelled';
    });
    if (match) return true;

    // 2. Compute dynamic, date-dependent booked slots hash
    const dateStr = selectedDate || '2026-08-24';
    const docStr = selectedDoctor.name || 'Marcus';
    const seed = docStr + dateStr;

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    hash = Math.abs(hash);

    // Pick 2 specific booked slots deterministically based on date + doctor hash
    const slotIndex1 = hash % TIME_SLOTS.length;
    const slotIndex2 = (hash + 3) % TIME_SLOTS.length;

    const bookedSlot1 = TIME_SLOTS[slotIndex1].slot;
    const bookedSlot2 = TIME_SLOTS[slotIndex2].slot;

    return slotTime === bookedSlot1 || slotTime === bookedSlot2;
  };

  // Auto-switch to first available time slot if currently selected slot is appointed on the chosen date
  useEffect(() => {
    if (isSlotBookedForOthers(selectedTime)) {
      const available = TIME_SLOTS.find(ts => !isSlotBookedForOthers(ts.slot));
      if (available) {
        setSelectedTime(available.slot);
      }
    }
  }, [selectedDoctor, selectedDate]);

  const handleSelectPresetReason = (preset) => {
    setReason(preset);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const modeLabel = consultationType === 'telehealth' ? 'Virtual HD Telehealth' : 'In-Clinic Physical Visit';
      const res = await apiService.bookAppointment({
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: selectedDate,
        timeSlot: selectedTime,
        reason: reason ? `${reason} (${modeLabel})` : `General Consultation (${modeLabel})`
      });
      if (onAppointmentBooked) onAppointmentBooked(res);
      onClose();
    } catch (err) {
      alert(err.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(7, 13, 30, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '700px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '30px',
        border: '1px solid rgba(163, 230, 53, 0.4)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '14px', background: 'rgba(163, 230, 53, 0.15)', border: '1px solid #A3E635' }}>
              <Stethoscope size={24} color="#A3E635" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFF' }}>
                Schedule Specialist Consultation
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Select Preferred Date, Timings, & Confirm Appointment
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          {step === 1 ? (
            <div>
              
              {/* Doctor Focused Info Card */}
              <div style={{
                background: 'rgba(163, 230, 53, 0.08)',
                border: '1px solid rgba(163, 230, 53, 0.35)',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={selectedDoctor.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                    alt={selectedDoctor.name}
                    style={{ width: '68px', height: '68px', borderRadius: '18px', objectFit: 'cover', border: '2px solid #A3E635' }}
                  />
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFF' }}>{selectedDoctor.name}</div>
                    <div style={{ fontSize: '0.84rem', color: '#A3E635', fontWeight: '700', marginTop: '2px' }}>
                      {selectedDoctor.title || selectedDoctor.specialty}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{selectedDoctor.hospital || 'MediCare AI Center'}</span>
                      <span style={{ color: '#FCD34D', fontWeight: '700' }}>{selectedDoctor.rating || '4.9 ★'}</span>
                      <span style={{ color: '#A3E635', fontWeight: '800', background: 'rgba(163, 230, 53, 0.15)', padding: '1px 8px', borderRadius: '10px' }}>
                        Fee: {selectedDoctor.fee || '$120'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDoctorPicker(!showDoctorPicker)}
                  className="btn-glass"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                >
                  {showDoctorPicker ? 'Hide List' : 'Change Doctor'}
                </button>
              </div>

              {/* Optional Doctor Picker Dropdown (Only when user clicks Change Doctor) */}
              {showDoctorPicker && (
                <div style={{ marginBottom: '20px', background: 'rgba(11, 19, 43, 0.8)', border: '1px solid var(--border-glass)', padding: '14px', borderRadius: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '700' }}>Select Specialist:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    {DOCTORS.map((doc) => (
                      <div
                        key={doc.name}
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setShowDoctorPicker(false);
                        }}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '12px',
                          background: selectedDoctor.name === doc.name ? 'rgba(163, 230, 53, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${selectedDoctor.name === doc.name ? '#A3E635' : 'var(--border-glass)'}`,
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#FFF' }}>{doc.name}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{doc.specialty}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 1. Visit Format Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700' }}>
                  1. Consultation Mode
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div
                    onClick={() => setConsultationType('telehealth')}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      background: consultationType === 'telehealth' ? 'rgba(163, 230, 53, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${consultationType === 'telehealth' ? '#A3E635' : 'var(--border-glass)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(163, 230, 53, 0.2)' }}>
                      <Video size={20} color="#A3E635" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: consultationType === 'telehealth' ? '#A3E635' : '#FFF' }}>
                        Virtual HD Telehealth
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Encrypted Video Call</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setConsultationType('in-person')}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      background: consultationType === 'in-person' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${consultationType === 'in-person' ? '#38BDF8' : 'var(--border-glass)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.2)' }}>
                      <Building2 size={20} color="#38BDF8" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: consultationType === 'in-person' ? '#38BDF8' : '#FFF' }}>
                        In-Person Clinic Visit
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Physical Medical Center</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Select Date (Horizontal Pill Selector) */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700' }}>
                  2. Select Appointment Date
                </label>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {calendarDays.map((day) => {
                    const isSelected = selectedDate === day.iso;
                    return (
                      <button
                        key={day.iso}
                        type="button"
                        onClick={() => setSelectedDate(day.iso)}
                        style={{
                          flex: '0 0 auto',
                          padding: '10px 16px',
                          borderRadius: '16px',
                          background: isSelected ? '#A3E635' : 'rgba(255, 255, 255, 0.04)',
                          color: isSelected ? '#070D1E' : '#FFF',
                          border: `1px solid ${isSelected ? '#A3E635' : 'var(--border-glass)'}`,
                          cursor: 'pointer',
                          textAlign: 'center',
                          fontWeight: '800',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>{day.displayDay}</div>
                        <div style={{ fontSize: '1.2rem' }}>{day.displayNum}</div>
                        <div style={{ fontSize: '0.65rem' }}>{day.month}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Available vs Appointed Timings Slots */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    3. Select Timings Slot
                  </label>
                  <div style={{ fontSize: '0.75rem', display: 'flex', gap: '12px' }}>
                    <span style={{ color: '#A3E635', fontWeight: '700' }}>🟢 Available Slot</span>
                    <span style={{ color: '#FCA5A5', fontWeight: '700' }}>🔴 Appointed for Others</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {TIME_SLOTS.map((ts) => {
                    const isBooked = isSlotBookedForOthers(ts.slot);
                    const isSelected = selectedTime === ts.slot && !isBooked;

                    if (isBooked) {
                      return (
                        <div
                          key={ts.slot}
                          title="This time slot is appointed for another patient."
                          style={{
                            padding: '8px 14px',
                            borderRadius: 'var(--radius-pill)',
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#FCA5A5',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'not-allowed',
                            opacity: 0.75
                          }}
                        >
                          <Lock size={13} color="#EF4444" />
                          <span style={{ textDecoration: 'line-through' }}>{ts.slot}</span>
                          <span style={{ fontSize: '0.65rem', background: '#EF4444', color: '#FFF', padding: '1px 6px', borderRadius: '8px', fontWeight: '700' }}>
                            Booked
                          </span>
                        </div>
                      );
                    }

                    return (
                      <PillChip
                        key={ts.slot}
                        label={ts.slot}
                        icon={Clock}
                        active={isSelected}
                        onClick={() => setSelectedTime(ts.slot)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* 4. Reason & Notes */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700' }}>
                  4. Consultation Reason & Notes
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {REASON_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSelectPresetReason(preset)}
                      style={{
                        background: reason === preset ? 'rgba(163, 230, 53, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${reason === preset ? '#A3E635' : 'var(--border-glass)'}`,
                        color: reason === preset ? '#A3E635' : 'var(--text-muted)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Or describe symptoms / reason..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={onClose} className="btn-glass" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="button" onClick={() => setStep(2)} className="btn-lime" style={{ flex: 1, justifyContent: 'center' }}>
                  Review Booking Details →
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Confirmation Receipt & Seal */
            <div>
              <div style={{
                background: 'rgba(163, 230, 53, 0.08)',
                border: '1px solid #A3E635',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#A3E635', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={22} color="#A3E635" /> Consultation Booking Summary
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Specialist Doctor:</span>
                    <strong style={{ color: '#FFF' }}>{selectedDoctor.name} ({selectedDoctor.specialty})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>
                    <strong style={{ color: '#A3E635' }}>{selectedDate} at {selectedTime}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Visit Format:</span>
                    <strong style={{ color: consultationType === 'telehealth' ? '#A3E635' : '#38BDF8' }}>
                      {consultationType === 'telehealth' ? 'Virtual HD Telehealth' : 'In-Person Clinic Visit'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Reason / Notes:</span>
                    <strong style={{ color: '#FFF' }}>{reason || 'General Consultation'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Standard Fee / Patient Net Pay:</span>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ color: '#94A3B8', textDecoration: 'line-through', fontSize: '0.88rem', marginRight: '8px' }}>{selectedDoctor.fee || '$120'}</strong>
                      <strong style={{ color: '#A3E635', fontSize: '1.05rem' }}>$0 (Covered by MediCare AI Plan)</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setStep(1)} className="btn-glass" style={{ flex: 1, justifyContent: 'center' }}>
                  ← Back to Modify
                </button>
                <button type="submit" disabled={loading} className="btn-lime" style={{ flex: 1, justifyContent: 'center', padding: '14px', fontSize: '0.95rem' }}>
                  {loading ? 'Confirming with Specialist...' : <><CheckCircle2 size={20} /> Finalize & Place Appointment</>}
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
