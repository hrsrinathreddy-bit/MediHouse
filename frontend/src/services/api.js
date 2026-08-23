const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('medicare_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  let data;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    throw new Error(`Backend server unreachable or returned non-JSON response (${res.status}). Please ensure backend is running.`);
  }

  if (!res.ok) {
    throw new Error(data.message || `API request failed with status ${res.status}`);
  }
  return data;
};

export const apiService = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Vitals
  getVitals: async (userId) => {
    const url = userId ? `${API_BASE}/vitals?userId=${userId}` : `${API_BASE}/vitals`;
    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res);
  },

  addVitals: async (vitalsData) => {
    const res = await fetch(`${API_BASE}/vitals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(vitalsData)
    });
    return handleResponse(res);
  },

  // Appointments
  getAppointments: async () => {
    const res = await fetch(`${API_BASE}/appointments`, { headers: getHeaders() });
    return handleResponse(res);
  },

  bookAppointment: async (appointmentData) => {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(appointmentData)
    });
    return handleResponse(res);
  },

  updateAppointmentStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  // Symptoms
  getSymptomChecks: async () => {
    const res = await fetch(`${API_BASE}/symptoms`, { headers: getHeaders() });
    return handleResponse(res);
  },

  analyzeSymptoms: async (symptomData) => {
    const res = await fetch(`${API_BASE}/symptoms/analyze`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(symptomData)
    });
    return handleResponse(res);
  },

  // Admin
  getAdminMetrics: async () => {
    const res = await fetch(`${API_BASE}/admin/metrics`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getAdminPatients: async () => {
    const res = await fetch(`${API_BASE}/admin/patients`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getPrescriptions: async () => {
    const res = await fetch(`${API_BASE}/admin/prescriptions`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Doctors Roster Management
  getDoctors: async () => {
    const res = await fetch(`${API_BASE}/admin/doctors`, { headers: getHeaders() });
    return handleResponse(res);
  },

  addDoctor: async (doctorData) => {
    const res = await fetch(`${API_BASE}/admin/doctors`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(doctorData)
    });
    return handleResponse(res);
  },

  deleteDoctor: async (id) => {
    const res = await fetch(`${API_BASE}/admin/doctors/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Wellness & Yoga Management
  getWellnessTips: async () => {
    const res = await fetch(`${API_BASE}/admin/wellness`, { headers: getHeaders() });
    return handleResponse(res);
  },

  addWellnessTip: async (tipData) => {
    const res = await fetch(`${API_BASE}/admin/wellness`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(tipData)
    });
    return handleResponse(res);
  },

  deleteWellnessTip: async (id) => {
    const res = await fetch(`${API_BASE}/admin/wellness/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
