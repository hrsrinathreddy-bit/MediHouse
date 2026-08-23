import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { DoctorRosterDashboard } from './components/DoctorRosterDashboard';
import { WellnessYogaHub } from './components/WellnessYogaHub';
import { AISymptomCheckerModal } from './components/AISymptomCheckerModal';
import { AppointmentModal } from './components/AppointmentModal';
import './styles/theme.css';

const MainContent = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'doctors', or 'wellness'
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  const handleOpenBooking = (doc = null) => {
    setSelectedDoctorForBooking(doc);
    setIsBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A3E635', fontSize: '1.2rem', fontWeight: '700' }}>
        Initializing MediCare AI Engine...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onOpenSymptomChecker={() => setIsSymptomModalOpen(true)}
        currentView={currentView}
        onChangeView={setCurrentView}
      />

      <main style={{ flex: 1 }}>
        {currentView === 'doctors' ? (
          <DoctorRosterDashboard
            onSelectDoctorToBook={(doc) => handleOpenBooking(doc)}
          />
        ) : currentView === 'wellness' ? (
          <WellnessYogaHub />
        ) : user.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <PatientDashboard
            onOpenSymptomChecker={() => setIsSymptomModalOpen(true)}
            onOpenBooking={() => handleOpenBooking(null)}
          />
        )}
      </main>

      {/* Global Action Modals */}
      <AISymptomCheckerModal
        isOpen={isSymptomModalOpen}
        onClose={() => setIsSymptomModalOpen(false)}
      />
      
      <AppointmentModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedDoctorForBooking(null);
        }}
        initialDoctor={selectedDoctorForBooking}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
