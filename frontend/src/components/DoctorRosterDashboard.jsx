import React, { useState, useEffect } from 'react';
import { Stethoscope, Calendar, Clock, Star, Video, Building2, Search, CheckCircle2, ShieldCheck, MapPin, Award, DollarSign } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { PillChip } from './PillChip';
import { apiService } from '../services/api';

export const DOCTORS_ROSTER = [
  {
    id: 'doc_1',
    name: 'Dr. Marcus Chen, MD',
    title: 'Chief Senior Cardiologist',
    specialty: 'Cardiology & Cardiovascular Surgery',
    fee: '$150',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    rating: '4.9',
    reviewsCount: 420,
    experience: '14 Years Exp',
    hospital: 'Johns Hopkins Medical Center',
    location: 'Building A, Suite 402 • Main Hospital Campus',
    status: 'Available Today',
    statusType: 'available',
    nextSlot: '10:30 AM',
    bio: 'Pioneer in minimally invasive catheterization, cardiac arrhythmia therapy, and lipid management.',
    scheduleDays: 'Mon, Wed, Fri (09:00 AM - 01:00 PM) | Tue, Thu (02:00 PM - 06:00 PM)',
    slots: ['09:00 AM', '10:30 AM', '01:15 PM', '02:45 PM', '04:15 PM']
  },
  {
    id: 'doc_2',
    name: 'Dr. Emily Carter, MD',
    title: 'Primary Care Director',
    specialty: 'General Practice & Internal Medicine',
    fee: '$95',
    photo: 'https://images.unsplash.com/photo-1594824813566-82823d5afe4a?auto=format&fit=crop&w=400&q=80',
    rating: '5.0',
    reviewsCount: 510,
    experience: '10 Years Exp',
    hospital: 'Stanford Health Care Institute',
    location: 'Wellness Center • Floor 2, Room 210',
    status: 'Live Telehealth Available',
    statusType: 'telehealth',
    nextSlot: '09:00 AM',
    bio: 'Dedicated family physician specializing in preventive health screenings, hypertension, and wellness optimization.',
    scheduleDays: 'Mon - Fri (08:30 AM - 04:00 PM) | Sat (09:00 AM - 12:00 PM)',
    slots: ['08:30 AM', '09:00 AM', '11:00 AM', '01:30 PM', '03:00 PM']
  },
  {
    id: 'doc_3',
    name: 'Dr. Aris Thorne, MD, PhD',
    title: 'Director of Neurology Institute',
    specialty: 'Clinical Neurology & Brain Health',
    fee: '$175',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    rating: '4.8',
    reviewsCount: 310,
    experience: '18 Years Exp',
    hospital: 'Mayo Clinic Health Network',
    location: 'Neuroscience Wing • Suite 605',
    status: 'In Clinic Today',
    statusType: 'in-clinic',
    nextSlot: '01:15 PM',
    bio: 'Leading researcher in neuro-regenerative therapy, migraine prevention, and stroke rehabilitation.',
    scheduleDays: 'Tue, Thu, Sat (10:00 AM - 05:00 PM)',
    slots: ['10:00 AM', '11:30 AM', '01:15 PM', '03:30 PM', '04:45 PM']
  },
  {
    id: 'doc_4',
    name: 'Dr. Sophia Sterling, MD',
    title: 'Head of Endocrinology',
    specialty: 'Endocrinology & Diabetic Management',
    fee: '$130',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    rating: '4.9',
    reviewsCount: 290,
    experience: '12 Years Exp',
    hospital: 'Columbia University Medical Network',
    location: 'Endocrine Clinic • Room 304',
    status: 'Available Today',
    statusType: 'available',
    nextSlot: '02:45 PM',
    bio: 'Specialist in thyroid disorders, continuous glucose monitoring, and hormonal health restoration.',
    scheduleDays: 'Mon, Wed (01:00 PM - 07:00 PM) | Fri (09:00 AM - 03:00 PM)',
    slots: ['09:00 AM', '11:00 AM', '01:00 PM', '02:45 PM', '05:00 PM']
  },
  {
    id: 'doc_5',
    name: 'Dr. Julian Vance, MD',
    title: 'Senior Clinical Dermatologist',
    specialty: 'Dermatology & Oncology',
    fee: '$120',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    rating: '4.9',
    reviewsCount: 380,
    experience: '9 Years Exp',
    hospital: 'Yale New Haven Hospital Network',
    location: 'Dermatology Wing • Suite 108',
    status: 'In Clinic Today',
    statusType: 'in-clinic',
    nextSlot: '11:00 AM',
    bio: 'Expert in dermatological oncology, eczema management, and advanced therapeutic laser treatments.',
    scheduleDays: 'Mon, Tue, Thu (09:30 AM - 04:30 PM)',
    slots: ['09:30 AM', '11:00 AM', '01:45 PM', '03:15 PM', '04:00 PM']
  },
  {
    id: 'doc_6',
    name: 'Dr. Maya Lin, MD',
    title: 'Metabolic & Longevity Specialist',
    specialty: 'Integrative Wellness & Longevity',
    fee: '$140',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    rating: '5.0',
    reviewsCount: 450,
    experience: '11 Years Exp',
    hospital: 'UCLA Medical Center',
    location: 'Longevity Hub • Floor 4, Suite 412',
    status: 'Live Telehealth Available',
    statusType: 'telehealth',
    nextSlot: '04:15 PM',
    bio: 'Focused on biological age optimization, metabolic health, nutrition, and cardiovascular longevity.',
    scheduleDays: 'Wed, Fri, Sat (10:00 AM - 04:00 PM)',
    slots: ['10:00 AM', '11:45 AM', '02:00 PM', '03:30 PM', '04:15 PM']
  }
];

export const DoctorRosterDashboard = ({ onSelectDoctorToBook }) => {
  const [doctors, setDoctors] = useState(DOCTORS_ROSTER);
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);

  useEffect(() => {
    apiService.getDoctors()
      .then(res => {
        if (res && res.length > 0) {
          setDoctors(res);
        }
      })
      .catch(err => console.error('Failed to fetch dynamic doctors:', err));
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = (doc.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (doc.specialty || '').toLowerCase().includes(search.toLowerCase()) ||
                          (doc.hospital || '').toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'All' || (doc.specialty || '').toLowerCase().includes(specialtyFilter.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  const getStatusBadge = (statusType, text) => {
    switch (statusType) {
      case 'telehealth':
        return { bg: 'rgba(56, 189, 248, 0.15)', border: '#38BDF8', color: '#38BDF8', icon: Video };
      case 'in-clinic':
        return { bg: 'rgba(245, 158, 11, 0.15)', border: '#F59E0B', color: '#FCD34D', icon: Building2 };
      default:
        return { bg: 'rgba(163, 230, 53, 0.15)', border: '#A3E635', color: '#A3E635', icon: CheckCircle2 };
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 28px 60px 28px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px 32px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(11, 19, 43, 0.9) 100%)', border: '1px solid rgba(163, 230, 53, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(163, 230, 53, 0.2)', border: '1px solid #A3E635' }}>
                <Stethoscope size={24} color="#A3E635" />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFF' }}>
                Specialist Doctors & Live Schedule Roster
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Direct Specialist Profiles, Verified Consultancy Fees, & Live Consultation Timings
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '13px' }} />
            <input
              type="text"
              className="input-glass"
              placeholder="Search by doctor, specialty, hospital..."
              style={{ paddingLeft: '42px', borderRadius: 'var(--radius-pill)' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Specialty Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          <PillChip label="All Specialists" active={specialtyFilter === 'All'} onClick={() => setSpecialtyFilter('All')} count={DOCTORS_ROSTER.length} />
          <PillChip label="Cardiology" active={specialtyFilter === 'Cardiology'} onClick={() => setSpecialtyFilter('Cardiology')} />
          <PillChip label="General Practice" active={specialtyFilter === 'General'} onClick={() => setSpecialtyFilter('General')} />
          <PillChip label="Neurology" active={specialtyFilter === 'Neurology'} onClick={() => setSpecialtyFilter('Neurology')} />
          <PillChip label="Endocrinology" active={specialtyFilter === 'Endocrinology'} onClick={() => setSpecialtyFilter('Endocrinology')} />
          <PillChip label="Dermatology" active={specialtyFilter === 'Dermatology'} onClick={() => setSpecialtyFilter('Dermatology')} />
          <PillChip label="Wellness & Longevity" active={specialtyFilter === 'Wellness'} onClick={() => setSpecialtyFilter('Wellness')} />
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {filteredDoctors.map((doc) => {
          const badge = getStatusBadge(doc.statusType, doc.status);
          const StatusIcon = badge.icon;

          return (
            <GlassCard key={doc.id} interactive style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
              
              {/* Top Doctor Info Header */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                {/* Doctor Portrait */}
                <div style={{ position: 'relative' }}>
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '20px',
                      objectFit: 'cover',
                      border: '2px solid rgba(163, 230, 53, 0.4)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
                    }}
                  />
                  {/* Rating Tag */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#070D1E',
                    border: '1px solid #FCD34D',
                    color: '#FCD34D',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    padding: '1px 7px',
                    borderRadius: '10px',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <Star size={10} fill="#FCD34D" color="#FCD34D" /> {doc.rating}
                  </div>
                </div>

                {/* Doctor Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFF' }}>{doc.name}</h3>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#A3E635', marginTop: '2px' }}>
                    {doc.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {doc.specialty}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={13} color="#38BDF8" /> {doc.experience} • {doc.reviewsCount}+ Patient Reviews
                  </div>
                </div>
              </div>

              {/* Status Badge & Consultancy Fee */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  background: badge.bg,
                  border: `1px solid ${badge.border}`,
                  color: badge.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <StatusIcon size={14} /> {doc.status}
                </span>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Consultancy Fee</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#A3E635' }}>
                    {doc.fee} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>/ visit</span>
                  </span>
                </div>
              </div>

              {/* Doctor Bio Snippet */}
              <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '20px' }}>
                {doc.bio}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button
                  onClick={() => setSelectedDoctorModal(doc)}
                  className="btn-glass"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '10px' }}
                >
                  Full Bio & Hospital
                </button>
                <button
                  onClick={() => onSelectDoctorToBook && onSelectDoctorToBook(doc)}
                  className="btn-lime"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '10px' }}
                >
                  <Calendar size={16} /> Book ({doc.fee})
                </button>
              </div>

            </GlassCard>
          );
        })}
      </div>

      {/* Doctor Full Bio Modal */}
      {selectedDoctorModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(7, 13, 30, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '28px', border: '1px solid #A3E635' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img src={selectedDoctorModal.photo} alt={selectedDoctorModal.name} style={{ width: '70px', height: '70px', borderRadius: '16px', objectFit: 'cover', border: '2px solid #A3E635' }} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFF' }}>{selectedDoctorModal.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#A3E635', fontWeight: '700' }}>{selectedDoctorModal.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selectedDoctorModal.specialty}</div>
                </div>
              </div>
              <button onClick={() => setSelectedDoctorModal(null)} className="btn-glass" style={{ padding: '6px 12px' }}>Close</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', marginBottom: '22px' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Hospital Affiliation:</strong> {selectedDoctorModal.hospital}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Facility Location:</strong> {selectedDoctorModal.location}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Clinical Rating:</strong> {selectedDoctorModal.rating} ★ ({selectedDoctorModal.reviewsCount} verified patient reviews)</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Experience:</strong> {selectedDoctorModal.experience}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Consultancy Fee:</strong> <span style={{ color: '#A3E635', fontWeight: '800', fontSize: '1.1rem' }}>{selectedDoctorModal.fee} per consultation</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Detailed Background:</strong> {selectedDoctorModal.bio}</div>
            </div>

            <button
              onClick={() => {
                const doc = selectedDoctorModal;
                setSelectedDoctorModal(null);
                if (onSelectDoctorToBook) onSelectDoctorToBook(doc);
              }}
              className="btn-lime"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.92rem' }}
            >
              <Calendar size={18} /> Book Direct Consultation ({selectedDoctorModal.fee})
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
