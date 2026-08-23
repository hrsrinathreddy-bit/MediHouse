import React, { useState, useEffect, useMemo } from 'react';
import { Users, Calendar, AlertTriangle, ShieldCheck, Search, Activity, Pill, CheckCircle2, XCircle, FileText, ChevronRight, Layers, FileSpreadsheet, Stethoscope, Plus, Trash2, UserPlus, Lock, Flower2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { GlassCard } from '../components/GlassCard';
import { StatCard } from '../components/StatCard';
import { PillChip } from '../components/PillChip';

export const AdminDashboard = () => {
  const { user } = useAuth();

  const [metrics, setMetrics] = useState({
    totalPatients: 0,
    scheduledAppointments: 0,
    highRiskTriageCount: 0,
    totalAIChecksProcessed: 0,
    totalPrescriptions: 0
  });

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [symptomChecks, setSymptomChecks] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [wellnessList, setWellnessList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientSearch, setPatientSearch] = useState('');
  const [rxSearch, setRxSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [wellnessSearch, setWellnessSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'patients', 'doctors', 'wellness', 'appointments', 'triages', 'prescriptions'
  const [selectedPatientModal, setSelectedPatientModal] = useState(null);
  const [selectedMergedDossier, setSelectedMergedDossier] = useState(null);

  // Add Doctor Modal & Form State
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [addDoctorLoading, setAddDoctorLoading] = useState(false);
  const [newDocForm, setNewDocForm] = useState({
    name: '',
    title: '',
    specialty: '',
    fee: '$120',
    hospital: '',
    experience: '10 Years Exp',
    bio: '',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
  });

  // Add Wellness Modal & Form State
  const [isAddWellnessModalOpen, setIsAddWellnessModalOpen] = useState(false);
  const [addWellnessLoading, setAddWellnessLoading] = useState(false);
  const [newWellnessForm, setNewWellnessForm] = useState({
    title: '',
    category: 'Yoga Asana',
    duration: '10 Mins',
    benefit: '',
    steps: '',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80'
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [mRes, pRes, aRes, sRes, rxRes, docRes, wellRes] = await Promise.all([
        apiService.getAdminMetrics(),
        apiService.getAdminPatients(),
        apiService.getAppointments(),
        apiService.getSymptomChecks(),
        apiService.getPrescriptions(),
        apiService.getDoctors(),
        apiService.getWellnessTips()
      ]);
      setMetrics(mRes);
      setPatients(pRes);
      setAppointments(aRes);
      setSymptomChecks(sRes);
      setPrescriptions(rxRes || []);
      setDoctorsList(docRes || []);
      setWellnessList(wellRes || []);
    } catch (err) {
      console.error('Fetch admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      await apiService.updateAppointmentStatus(apptId, newStatus);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  // Add New Doctor Handler (Admin Permission)
  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    if (!newDocForm.name || !newDocForm.specialty) {
      alert('Please fill in Doctor Name and Specialty.');
      return;
    }
    setAddDoctorLoading(true);
    try {
      await apiService.addDoctor(newDocForm);
      alert(`Success: ${newDocForm.name} has been added to the system roster!`);
      setIsAddDoctorModalOpen(false);
      setNewDocForm({
        name: '',
        title: '',
        specialty: '',
        fee: '$120',
        hospital: '',
        experience: '10 Years Exp',
        bio: '',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
      });
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to add doctor.');
    } finally {
      setAddDoctorLoading(false);
    }
  };

  // Remove Doctor Handler (Admin Permission)
  const handleDeleteDoctor = async (doc) => {
    const docId = doc.id || doc._id;
    if (!window.confirm(`Are you sure you want to remove ${doc.name} from the medical roster?`)) {
      return;
    }
    try {
      await apiService.deleteDoctor(docId);
      alert(`Success: ${doc.name} has been removed from the system roster.`);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to delete doctor.');
    }
  };

  // Add New Wellness Tip Handler (Admin Permission)
  const handleAddWellnessSubmit = async (e) => {
    e.preventDefault();
    if (!newWellnessForm.title || !newWellnessForm.category) {
      alert('Please fill in Title and Category.');
      return;
    }
    setAddWellnessLoading(true);
    try {
      await apiService.addWellnessTip({
        ...newWellnessForm,
        steps: newWellnessForm.steps ? newWellnessForm.steps.split('\n').filter(Boolean) : ['Follow standard clinical practice.']
      });
      alert(`Success: "${newWellnessForm.title}" published to Wellness & Yoga Hub!`);
      setIsAddWellnessModalOpen(false);
      setNewWellnessForm({
        title: '',
        category: 'Yoga Asana',
        duration: '10 Mins',
        benefit: '',
        steps: '',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80'
      });
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to add wellness tip.');
    } finally {
      setAddWellnessLoading(false);
    }
  };

  // Remove Wellness Tip Handler (Admin Permission)
  const handleDeleteWellness = async (tip) => {
    const tipId = tip.id || tip._id;
    if (!window.confirm(`Admin Permission Confirmation: Remove "${tip.title}" from system wellness guide?`)) {
      return;
    }
    try {
      await apiService.deleteWellnessTip(tipId);
      alert(`Success: "${tip.title}" removed.`);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to delete wellness tip.');
    }
  };

  // Merge all triages, appointments, & prescriptions by unique patient record
  const mergedPatientReports = useMemo(() => {
    const map = {};

    // 1. Add base registered patients
    patients.forEach(p => {
      const key = (p.name || 'Anonymous').toLowerCase().trim();
      map[key] = {
        id: p._id || p.id,
        name: p.name,
        email: p.email,
        age: p.age || 38,
        gender: p.gender || 'Male',
        bloodType: p.bloodType || 'A+',
        emergencyContact: p.emergencyContact || '+1 (555) 234-5678',
        triages: [],
        appointments: [],
        prescriptions: [],
        symptomsSet: new Set(),
        maxScore: 0,
        highestRisk: 'normal'
      };
    });

    // 2. Merge symptom triages
    symptomChecks.forEach(s => {
      const key = (s.patientName || 'Anonymous').toLowerCase().trim();
      if (!map[key]) {
        map[key] = {
          id: s._id,
          name: s.patientName || 'Anonymous Patient',
          email: s.patientEmail || `${key.replace(/\s+/g, '')}@medicare.ai`,
          age: s.age || 38,
          gender: s.gender || 'Male',
          bloodType: 'A+',
          emergencyContact: '+1 (555) 234-5678',
          triages: [],
          appointments: [],
          prescriptions: [],
          symptomsSet: new Set(),
          maxScore: 0,
          highestRisk: 'normal'
        };
      }
      map[key].triages.push(s);
      (s.symptoms || []).forEach(sym => map[key].symptomsSet.add(sym));
      if (s.score > map[key].maxScore) {
        map[key].maxScore = s.score;
      }
      if (s.triageLevel === 'emergency' || s.triageLevel === 'high') {
        map[key].highestRisk = s.triageLevel;
      }
    });

    // 3. Merge appointments
    appointments.forEach(a => {
      const key = (a.patientName || 'Anonymous').toLowerCase().trim();
      if (!map[key]) {
        map[key] = {
          id: a._id,
          name: a.patientName || 'Anonymous Patient',
          email: `${key.replace(/\s+/g, '')}@medicare.ai`,
          age: 38,
          gender: 'Male',
          bloodType: 'A+',
          emergencyContact: '+1 (555) 234-5678',
          triages: [],
          appointments: [],
          prescriptions: [],
          symptomsSet: new Set(),
          maxScore: 0,
          highestRisk: 'normal'
        };
      }
      map[key].appointments.push(a);
    });

    // 4. Merge prescriptions
    prescriptions.forEach(rx => {
      const key = (rx.patientName || 'Anonymous').toLowerCase().trim();
      if (map[key]) {
        map[key].prescriptions.push(rx);
      }
    });

    return Object.values(map).map(p => ({
      ...p,
      allSymptoms: Array.from(p.symptomsSet),
      latestTriage: p.triages.length > 0 ? p.triages[0] : null
    }));
  }, [patients, symptomChecks, appointments, prescriptions]);

  const highRiskMergedPatients = mergedPatientReports.filter(p => p.highestRisk === 'emergency' || p.highestRisk === 'high');

  const filteredPatients = mergedPatientReports.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.email.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredPrescriptions = prescriptions.filter(rx =>
    rx.patientName.toLowerCase().includes(rxSearch.toLowerCase()) ||
    rx.medication.toLowerCase().includes(rxSearch.toLowerCase()) ||
    rx.prescribingDoctor.toLowerCase().includes(rxSearch.toLowerCase())
  );

  const filteredDoctors = doctorsList.filter(d =>
    (d.name || '').toLowerCase().includes(doctorSearch.toLowerCase()) ||
    (d.specialty || '').toLowerCase().includes(doctorSearch.toLowerCase()) ||
    (d.hospital || '').toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const filteredWellness = wellnessList.filter(w =>
    (w.title || '').toLowerCase().includes(wellnessSearch.toLowerCase()) ||
    (w.category || '').toLowerCase().includes(wellnessSearch.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 28px 60px 28px' }}>
      
      {/* Admin Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(11, 19, 43, 0.9) 100%)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFF' }}>
                Clinical Operations & Administrative Permissions Command
              </h2>
              <span style={{ background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38BDF8', color: '#38BDF8', fontSize: '0.75rem', fontWeight: '700', padding: '2px 10px', borderRadius: 'var(--radius-pill)' }}>
                Chief Director: {user?.name} (Admin Authority)
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Doctor Roster • Wellness & Yoga Permissions • Merged Patient Records • Pharmacy
            </p>
          </div>

          {/* Tab Navigation Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <PillChip label="System Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <PillChip label="Merged Patient Dossiers" count={mergedPatientReports.length} active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} />
            <PillChip label="Doctor Roster Admin" count={doctorsList.length} active={activeTab === 'doctors'} onClick={() => setActiveTab('doctors')} />
            <PillChip label="Wellness & Yoga Admin" count={wellnessList.length} active={activeTab === 'wellness'} onClick={() => setActiveTab('wellness')} />
            <PillChip label="Global Appointments" count={appointments.length} active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
            <PillChip label="High-Risk Triages" count={highRiskMergedPatients.length} active={activeTab === 'triages'} onClick={() => setActiveTab('triages')} />
            <PillChip label="System Prescriptions" count={prescriptions.length} active={activeTab === 'prescriptions'} onClick={() => setActiveTab('prescriptions')} />
          </div>
        </div>
      </div>

      {/* Admin Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        <StatCard
          title="Specialist Doctors"
          value={doctorsList.length}
          unit="rostered"
          status="Admin Managed"
          icon={Stethoscope}
          trend="Click to Manage Roster →"
          onClick={() => setActiveTab('doctors')}
          active={activeTab === 'doctors'}
        />
        <StatCard
          title="Wellness & Yoga Practices"
          value={wellnessList.length}
          unit="guides"
          status="Admin Managed"
          icon={Flower2}
          trend="Manage Practices →"
          onClick={() => setActiveTab('wellness')}
          active={activeTab === 'wellness'}
        />
        <StatCard
          title="Unique Patient Dossiers"
          value={mergedPatientReports.length}
          unit="merged"
          status="Unified"
          icon={Users}
          trend="Click for Unique Records →"
          onClick={() => setActiveTab('patients')}
          active={activeTab === 'patients'}
        />
        <StatCard
          title="Active Appointments"
          value={metrics.scheduledAppointments}
          unit="slots"
          status="Scheduled"
          icon={Calendar}
          trend="Click to Manage →"
          onClick={() => setActiveTab('appointments')}
          active={activeTab === 'appointments'}
        />
        <StatCard
          title="High Risk Unique Patients"
          value={highRiskMergedPatients.length}
          unit="flagged"
          status={highRiskMergedPatients.length > 0 ? 'High Risk' : 'Normal'}
          icon={AlertTriangle}
          trend="Click for High-Risk Dossiers →"
          onClick={() => setActiveTab('triages')}
          active={activeTab === 'triages'}
        />
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          
          {/* Merged Unique High-Risk Patient Dossiers */}
          <GlassCard style={{ border: highRiskMergedPatients.length > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444' }}>
                <AlertTriangle size={20} color="#EF4444" /> Merged High-Risk Patient Reports
              </h3>
              <span style={{ fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                {highRiskMergedPatients.length} Unique Patients Flagged
              </span>
            </div>

            {highRiskMergedPatients.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>
                No high-risk patient reports currently flagged.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {highRiskMergedPatients.map((patient) => (
                  <div key={patient.name} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '18px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFF' }}>{patient.name}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
                          ({patient.triages.length} Scans • {patient.appointments.length} Consultations)
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', background: '#EF4444', color: '#FFF', padding: '3px 10px', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase' }}>
                        {patient.highestRisk} (Max Score: {patient.maxScore})
                      </span>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                        CONSOLIDATED REPORTED SYMPTOMS:
                      </span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {patient.allSymptoms.map((s, i) => (
                          <span key={i} style={{ background: 'rgba(0, 0, 0, 0.4)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '3px 9px', borderRadius: '8px', fontSize: '0.76rem', fontWeight: '700' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedMergedDossier(patient)}
                      className="btn-glass"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', borderColor: '#EF4444', color: '#FCA5A5' }}
                    >
                      <Layers size={15} /> Inspect Merged Patient Dossier ({patient.name}) →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Quick Admin Permissions Overview Widget */}
          <GlassCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981' }}>
                <Flower2 size={20} color="#10B981" /> Wellness & Yoga Admin Authority
              </h3>
              <button onClick={() => setIsAddWellnessModalOpen(true)} className="btn-lime" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                <Plus size={14} /> + Add Wellness Tip
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {wellnessList.slice(0, 4).map((w) => (
                <div key={w.id || w._id} style={{ background: 'rgba(11, 19, 43, 0.6)', border: '1px solid var(--border-glass)', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={w.image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80'} alt={w.title} style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#FFF' }}>{w.title}</div>
                      <div style={{ fontSize: '0.76rem', color: '#10B981', fontWeight: '700' }}>{w.category} • {w.duration}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteWellness(w)} className="btn-danger" style={{ padding: '6px 10px', fontSize: '0.75rem' }} title="Delete Wellness Practice">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => setActiveTab('wellness')} className="btn-glass" style={{ width: '100%', justifyContent: 'center', marginTop: '16px', fontSize: '0.82rem' }}>
              Manage Complete Wellness & Yoga Practices ({wellnessList.length}) →
            </button>
          </GlassCard>

        </div>
      )}

      {/* 2. DOCTOR ROSTER MANAGEMENT TAB */}
      {activeTab === 'doctors' && (
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFF' }}>
                  Doctor Roster Admin Control & Permissions
                </h3>
                <span style={{ background: 'rgba(163, 230, 53, 0.15)', border: '1px solid #A3E635', color: '#A3E635', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> Admin Permission Active
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Add new specialists to live roster, configure consultancy fees, and manage physician access
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Search doctor or specialty..."
                  style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.82rem' }}
                  value={doctorSearch}
                  onChange={e => setDoctorSearch(e.target.value)}
                />
              </div>

              <button onClick={() => setIsAddDoctorModalOpen(true)} className="btn-lime" style={{ fontSize: '0.86rem', padding: '10px 18px' }}>
                <UserPlus size={18} /> + Add New Specialist Doctor
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Physician Photo & Name</th>
                  <th style={{ padding: '12px' }}>Title & Specialty</th>
                  <th style={{ padding: '12px' }}>Consultancy Fee</th>
                  <th style={{ padding: '12px' }}>Hospital Affiliation</th>
                  <th style={{ padding: '12px' }}>Experience</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Admin Permission Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doc) => (
                  <tr key={doc.id || doc._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={doc.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'} alt={doc.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #A3E635' }} />
                        <div>
                          <div style={{ fontWeight: '800', color: '#FFF' }}>{doc.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#FCD34D', fontWeight: '700' }}>★ {doc.rating || '5.0'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ color: '#A3E635', fontWeight: '700' }}>{doc.title || doc.specialty}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{doc.specialty}</div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#A3E635', background: 'rgba(163, 230, 53, 0.12)', padding: '2px 10px', borderRadius: '10px' }}>
                        {doc.fee || '$120'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-muted)' }}>{doc.hospital || 'MediCare AI Center'}</td>
                    <td style={{ padding: '14px 12px', color: '#FFF' }}>{doc.experience || '10+ Years'}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteDoctor(doc)}
                        className="btn-danger"
                        style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={15} /> Remove Doctor
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* 3. WELLNESS & YOGA ADMIN PERMISSIONS TAB */}
      {activeTab === 'wellness' && (
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFF' }}>
                  Wellness & Yoga Admin Permissions
                </h3>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> Admin Permission Active
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Publish new clinical yoga asanas, breathing protocols, and manage system health guides
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Search wellness practice..."
                  style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.82rem' }}
                  value={wellnessSearch}
                  onChange={e => setWellnessSearch(e.target.value)}
                />
              </div>

              <button onClick={() => setIsAddWellnessModalOpen(true)} className="btn-lime" style={{ fontSize: '0.86rem', padding: '10px 18px' }}>
                <Plus size={18} /> + Add New Yoga / Wellness Tip
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Practice & Image</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>Duration</th>
                  <th style={{ padding: '12px' }}>Clinical Benefit</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Admin Permission Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredWellness.map((w) => (
                  <tr key={w.id || w._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={w.image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80'} alt={w.title} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #10B981' }} />
                        <div style={{ fontWeight: '800', color: '#FFF' }}>{w.title}</div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 10px', borderRadius: '8px' }}>
                        {w.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#FFF' }}>{w.duration}</td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '300px' }}>
                      {w.benefit}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteWellness(w)}
                        className="btn-danger"
                        style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={15} /> Delete Practice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* 4. MERGED PATIENT DOSSIERS DIRECTORY TAB */}
      {activeTab === 'patients' && (
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={22} color="#38BDF8" /> Unique Patient Health Dossiers (Merged)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Consolidated clinical history, symptoms, appointments, & pharmacy orders per unique patient record
              </p>
            </div>
            
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                className="input-glass"
                placeholder="Search patient record..."
                style={{ paddingLeft: '38px', padding: '10px 12px 10px 38px' }}
                value={patientSearch}
                onChange={e => setPatientSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Patient Name</th>
                  <th style={{ padding: '12px' }}>Contact & Demographics</th>
                  <th style={{ padding: '12px' }}>Merged Symptoms</th>
                  <th style={{ padding: '12px' }}>Clinical Risk Score</th>
                  <th style={{ padding: '12px' }}>Total Records</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((pt) => (
                  <tr key={pt.name} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 12px', fontWeight: '700', color: '#FFF' }}>
                      <div>{pt.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>{pt.email}</div>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#FFF' }}>
                      <div>{pt.age} yrs / {pt.gender}</div>
                      <span style={{ background: 'rgba(163, 230, 53, 0.15)', border: '1px solid #A3E635', color: '#A3E635', padding: '1px 6px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700' }}>
                        Blood: {pt.bloodType}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '240px' }}>
                        {pt.allSymptoms.length === 0 ? (
                          <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>No symptoms flagged</span>
                        ) : (
                          pt.allSymptoms.map((sym, idx) => (
                            <span key={idx} style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#A3E635', padding: '2px 6px', borderRadius: '6px', fontSize: '0.72rem' }}>
                              {sym}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-pill)',
                        background: pt.highestRisk === 'emergency' || pt.highestRisk === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        border: `1px solid ${pt.highestRisk === 'emergency' || pt.highestRisk === 'high' ? '#EF4444' : '#10B981'}`,
                        color: pt.highestRisk === 'emergency' || pt.highestRisk === 'high' ? '#FCA5A5' : '#10B981',
                        textTransform: 'uppercase'
                      }}>
                        {pt.highestRisk === 'normal' ? 'Low Risk' : `${pt.highestRisk} (${pt.maxScore})`}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {pt.triages.length} Scans • {pt.appointments.length} Appts • {pt.prescriptions.length} Rxs
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button onClick={() => setSelectedMergedDossier(pt)} className="btn-lime" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                        <Layers size={14} /> Open Merged Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* 5. GLOBAL APPOINTMENTS TAB */}
      {activeTab === 'appointments' && (
        <GlassCard>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={22} color="#A3E635" /> Global Clinical Appointments Control
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {appointments.map((appt) => (
              <div key={appt._id} style={{ background: 'rgba(11, 19, 43, 0.6)', border: '1px solid var(--border-glass)', padding: '18px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFF' }}>{appt.patientName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Assigned Doctor: <strong style={{ color: '#A3E635' }}>{appt.doctorName}</strong> ({appt.specialty})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                    Schedule: {appt.date} at {appt.timeSlot} • Reason: {appt.reason || 'General Consultation'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {appt.status === 'scheduled' && (
                    <>
                      <button onClick={() => handleUpdateStatus(appt._id, 'completed')} className="btn-lime" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                        <CheckCircle2 size={16} /> Mark Completed
                      </button>
                      <button onClick={() => handleUpdateStatus(appt._id, 'cancelled')} className="btn-danger">
                        <XCircle size={16} /> Cancel
                      </button>
                    </>
                  )}
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', padding: '4px 12px', borderRadius: 'var(--radius-pill)', background: appt.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : appt.status === 'cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(163, 230, 53, 0.2)', color: appt.status === 'completed' ? '#10B981' : appt.status === 'cancelled' ? '#FCA5A5' : '#A3E635', textTransform: 'uppercase' }}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 6. TRIAGE MONITOR TAB */}
      {activeTab === 'triages' && (
        <GlassCard>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444' }}>
            <AlertTriangle size={22} color="#EF4444" /> Merged Clinical Triage Intelligence
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {highRiskMergedPatients.map((patient) => (
              <div key={patient.name} style={{ background: 'rgba(11, 19, 43, 0.85)', border: '1px solid #EF4444', padding: '20px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFF' }}>{patient.name}</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', background: '#EF4444', color: '#FFF', padding: '4px 12px', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase' }}>
                    {patient.highestRisk} Priority (Max Score: {patient.maxScore})
                  </span>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>CONSOLIDATED SYMPTOMS:</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {patient.allSymptoms.map((s, i) => (
                      <span key={i} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '3px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700' }}>{s}</span>
                    ))}
                  </div>
                </div>

                {patient.latestTriage && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5', background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: '10px', marginBottom: '14px' }}>
                    <strong>Latest Clinical Diagnosis:</strong> {patient.latestTriage.analysis}
                  </p>
                )}

                <button onClick={() => setSelectedMergedDossier(patient)} className="btn-lime" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                  <Layers size={16} /> Open Complete Merged Health Dossier
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 7. SYSTEM PRESCRIPTIONS TAB */}
      {activeTab === 'prescriptions' && (
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Pill size={22} color="#A3E635" /> System Prescriptions & Pharmacy Manager
            </h3>

            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                className="input-glass"
                placeholder="Search prescription..."
                style={{ paddingLeft: '38px', padding: '10px 12px 10px 38px' }}
                value={rxSearch}
                onChange={e => setRxSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredPrescriptions.map((rx) => (
              <div key={rx._id} style={{ background: 'rgba(11, 19, 43, 0.6)', border: '1px solid var(--border-glass)', padding: '18px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFF' }}>
                    {rx.patientName} — <span style={{ color: '#A3E635' }}>{rx.medication} ({rx.dosage})</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Frequency: {rx.frequency} • Prescribing Physician: <strong>{rx.prescribingDoctor}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '3px' }}>
                    Issued Date: {rx.issuedDate} • Duration: {rx.duration} • Instructions: {rx.instructions || 'Standard dosing'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', background: 'rgba(163, 230, 53, 0.15)', border: '1px solid #A3E635', color: '#A3E635', padding: '4px 12px', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase' }}>
                    {rx.refillsLeft} Refills Left ({rx.status})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ADD DOCTOR MODAL (Admin Permission) */}
      {isAddDoctorModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(7, 13, 30, 0.88)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', padding: '30px', border: '1px solid #A3E635' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(163, 230, 53, 0.2)', border: '1px solid #A3E635' }}>
                  <UserPlus size={22} color="#A3E635" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFF' }}>Add New Specialist Doctor</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Admin Roster Permission</p>
                </div>
              </div>
              <button onClick={() => setIsAddDoctorModalOpen(false)} className="btn-glass" style={{ padding: '6px 12px' }}>Close</button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  className="input-glass"
                  placeholder="e.g. Dr. Alexander Vance, MD"
                  value={newDocForm.name}
                  onChange={e => setNewDocForm({ ...newDocForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Clinical Title</label>
                  <input
                    type="text"
                    className="input-glass"
                    placeholder="e.g. Chief Vascular Surgeon"
                    value={newDocForm.title}
                    onChange={e => setNewDocForm({ ...newDocForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Specialty *</label>
                  <input
                    type="text"
                    required
                    className="input-glass"
                    placeholder="e.g. Cardiology & Vascular Surgery"
                    value={newDocForm.specialty}
                    onChange={e => setNewDocForm({ ...newDocForm, specialty: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Consultancy Fee</label>
                  <input
                    type="text"
                    className="input-glass"
                    placeholder="e.g. $160"
                    value={newDocForm.fee}
                    onChange={e => setNewDocForm({ ...newDocForm, fee: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Hospital Affiliation</label>
                  <input
                    type="text"
                    className="input-glass"
                    placeholder="e.g. Johns Hopkins Medical Network"
                    value={newDocForm.hospital}
                    onChange={e => setNewDocForm({ ...newDocForm, hospital: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Photo URL</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="https://..."
                  value={newDocForm.photo}
                  onChange={e => setNewDocForm({ ...newDocForm, photo: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Doctor Bio & Background</label>
                <textarea
                  className="input-glass"
                  rows={3}
                  placeholder="Brief clinical background..."
                  value={newDocForm.bio}
                  onChange={e => setNewDocForm({ ...newDocForm, bio: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddDoctorModalOpen(false)} className="btn-glass" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" disabled={addDoctorLoading} className="btn-lime" style={{ flex: 1, justifyContent: 'center' }}>
                  {addDoctorLoading ? 'Adding Doctor...' : 'Save & Add to System Roster'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ADD WELLNESS TIP MODAL (Admin Permission) */}
      {isAddWellnessModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(7, 13, 30, 0.88)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', padding: '30px', border: '1px solid #10B981' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981' }}>
                  <Plus size={22} color="#10B981" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFF' }}>Add New Yoga / Health Practice</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Admin Permission Active</p>
                </div>
              </div>
              <button onClick={() => setIsAddWellnessModalOpen(false)} className="btn-glass" style={{ padding: '6px 12px' }}>Close</button>
            </div>

            <form onSubmit={handleAddWellnessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Practice Title *</label>
                <input
                  type="text"
                  required
                  className="input-glass"
                  placeholder="e.g. Surya Namaskar (Sun Salutation)"
                  value={newWellnessForm.title}
                  onChange={e => setNewWellnessForm({ ...newWellnessForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Category *</label>
                  <select
                    className="input-glass"
                    value={newWellnessForm.category}
                    onChange={e => setNewWellnessForm({ ...newWellnessForm, category: e.target.value })}
                    style={{ background: '#070D1E', color: '#FFF' }}
                  >
                    <option value="Yoga Asana">Yoga Asana</option>
                    <option value="Yoga & Breathing">Yoga & Breathing</option>
                    <option value="Mindfulness">Mindfulness</option>
                    <option value="Nutrition & Hydration">Nutrition & Hydration</option>
                    <option value="Sleep Optimization">Sleep Optimization</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Duration</label>
                  <input
                    type="text"
                    className="input-glass"
                    placeholder="e.g. 15 Mins Morning"
                    value={newWellnessForm.duration}
                    onChange={e => setNewWellnessForm({ ...newWellnessForm, duration: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Clinical Health Benefit</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="e.g. Enhances cardiac flexibility, lowers systolic blood pressure, and boosts energy."
                  value={newWellnessForm.benefit}
                  onChange={e => setNewWellnessForm({ ...newWellnessForm, benefit: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Instructions (One per line)</label>
                <textarea
                  className="input-glass"
                  rows={4}
                  placeholder="Step 1: Inhale deeply...\nStep 2: Bend forward gracefully..."
                  value={newWellnessForm.steps}
                  onChange={e => setNewWellnessForm({ ...newWellnessForm, steps: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Image URL</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="https://..."
                  value={newWellnessForm.image}
                  onChange={e => setNewWellnessForm({ ...newWellnessForm, image: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddWellnessModalOpen(false)} className="btn-glass" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" disabled={addWellnessLoading} className="btn-lime" style={{ flex: 1, justifyContent: 'center' }}>
                  {addWellnessLoading ? 'Publishing...' : 'Publish Wellness Practice'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Merged Patient Complete Health Dossier Modal */}
      {selectedMergedDossier && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(7, 13, 30, 0.88)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', padding: '30px', border: '1px solid #A3E635' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#A3E635', fontWeight: '800', textTransform: 'uppercase' }}>CONSOLIDATED MERGED PATIENT DOSSIER</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFF' }}>{selectedMergedDossier.name}</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{selectedMergedDossier.email} • {selectedMergedDossier.age} yrs • Blood Type: {selectedMergedDossier.bloodType}</div>
              </div>
              <button onClick={() => setSelectedMergedDossier(null)} className="btn-glass" style={{ padding: '6px 14px' }}>Close</button>
            </div>

            <div style={{
              background: selectedMergedDossier.highestRisk === 'emergency' || selectedMergedDossier.highestRisk === 'high' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: `1px solid ${selectedMergedDossier.highestRisk === 'emergency' || selectedMergedDossier.highestRisk === 'high' ? '#EF4444' : '#10B981'}`,
              padding: '14px 18px',
              borderRadius: '14px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Highest Clinical Triage Status:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: selectedMergedDossier.highestRisk === 'emergency' || selectedMergedDossier.highestRisk === 'high' ? '#EF4444' : '#10B981', textTransform: 'uppercase' }}>
                  {selectedMergedDossier.highestRisk} Priority (Max Score: {selectedMergedDossier.maxScore})
                </div>
              </div>
              <ShieldCheck size={28} color={selectedMergedDossier.highestRisk === 'emergency' || selectedMergedDossier.highestRisk === 'high' ? '#EF4444' : '#10B981'} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>
                All Reported Symptoms (Merged Across Scans):
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedMergedDossier.allSymptoms.map((sym, idx) => (
                  <span key={idx} style={{ background: 'rgba(163, 230, 53, 0.15)', border: '1px solid #A3E635', color: '#A3E635', padding: '4px 12px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: '700' }}>
                    {sym}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '700' }}>
                AI Symptom Triage Scan Logs ({selectedMergedDossier.triages.length} Scans):
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedMergedDossier.triages.map((t, idx) => (
                  <div key={idx} style={{ background: 'rgba(11, 19, 43, 0.7)', border: '1px solid var(--border-glass)', padding: '12px 14px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#A3E635', marginBottom: '4px', fontWeight: '700' }}>
                      <span>Scan #{idx + 1} — Score: {t.score}/100</span>
                      <span>Level: {t.triageLevel}</span>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#FFF', lineHeight: '1.4' }}>{t.analysis}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '700' }}>
                Scheduled & Past Consultations ({selectedMergedDossier.appointments.length}):
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedMergedDossier.appointments.map((a, idx) => (
                  <div key={idx} style={{ background: 'rgba(11, 19, 43, 0.7)', border: '1px solid var(--border-glass)', padding: '10px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#FFF' }}>{a.doctorName} ({a.specialty})</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.date} at {a.timeSlot}</div>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.1)', color: '#FFF', textTransform: 'uppercase' }}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setSelectedMergedDossier(null)} className="btn-lime" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              Close Dossier
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
