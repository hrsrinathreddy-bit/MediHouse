const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const defaultPasswordHash = bcrypt.hashSync('password123', salt);

const initialUsers = [
  {
    _id: 'user_patient_1',
    name: 'Sarah Jenkins',
    email: 'patient@medicare.ai',
    password: defaultPasswordHash,
    role: 'patient',
    age: 34,
    gender: 'Female',
    bloodType: 'A+',
    allergies: ['Penicillin', 'Peanuts'],
    emergencyContact: '+1 (555) 234-5678',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'user_admin_1',
    name: 'Dr. Alexander Vance',
    email: 'admin@medicare.ai',
    password: defaultPasswordHash,
    role: 'admin',
    age: 48,
    gender: 'Male',
    title: 'Chief Medical Administrator',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'user_patient_2',
    name: 'John Doe',
    email: 'john.doe@medicare.ai',
    password: defaultPasswordHash,
    role: 'patient',
    age: 52,
    gender: 'Male',
    bloodType: 'O-',
    allergies: ['Sulfa drugs'],
    emergencyContact: '+1 (555) 876-5432',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'user_patient_3',
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@medicare.ai',
    password: defaultPasswordHash,
    role: 'patient',
    age: 29,
    gender: 'Female',
    bloodType: 'B+',
    allergies: ['None'],
    emergencyContact: '+1 (555) 345-6789',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const initialVitals = [
  {
    _id: 'vital_1',
    userId: 'user_patient_1',
    heartRate: 72,
    bloodPressureSys: 118,
    bloodPressureDia: 76,
    bloodGlucose: 95,
    oxygenLevel: 99,
    steps: 8420,
    sleepHours: 7.5,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'Normal'
  },
  {
    _id: 'vital_2',
    userId: 'user_patient_1',
    heartRate: 75,
    bloodPressureSys: 122,
    bloodPressureDia: 80,
    bloodGlucose: 102,
    oxygenLevel: 98,
    steps: 6100,
    sleepHours: 6.8,
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    status: 'Normal'
  },
  {
    _id: 'vital_3',
    userId: 'user_patient_1',
    heartRate: 88,
    bloodPressureSys: 135,
    bloodPressureDia: 88,
    bloodGlucose: 115,
    oxygenLevel: 97,
    steps: 4200,
    sleepHours: 5.5,
    timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    status: 'Elevated'
  },
  {
    _id: 'vital_4',
    userId: 'user_patient_2',
    heartRate: 104,
    bloodPressureSys: 148,
    bloodPressureDia: 94,
    bloodGlucose: 165,
    oxygenLevel: 94,
    steps: 2100,
    sleepHours: 4.8,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'High Risk'
  }
];

const initialAppointments = [
  {
    _id: 'appt_1',
    userId: 'user_patient_1',
    patientName: 'Sarah Jenkins',
    doctorName: 'Dr. Marcus Chen',
    specialty: 'Cardiology Specialist',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeSlot: '10:30 AM',
    status: 'scheduled',
    reason: 'Quarterly Cardiac Follow-up & ECG Review',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'appt_2',
    userId: 'user_patient_1',
    patientName: 'Sarah Jenkins',
    doctorName: 'Dr. Emily Carter',
    specialty: 'General Practitioner',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeSlot: '02:15 PM',
    status: 'scheduled',
    reason: 'Annual Wellness Examination & Lab Review',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'appt_3',
    userId: 'user_patient_2',
    patientName: 'John Doe',
    doctorName: 'Dr. Sophia Sterling',
    specialty: 'Endocrinologist',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeSlot: '09:00 AM',
    status: 'scheduled',
    reason: 'Blood Glucose Triage Evaluation',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'appt_4',
    userId: 'user_patient_1',
    patientName: 'Sarah Jenkins',
    doctorName: 'Dr. Aris Thorne',
    specialty: 'Neurology',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeSlot: '11:00 AM',
    status: 'completed',
    reason: 'Migraine Assessment & MRI Results',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const initialSymptomChecks = [
  {
    _id: 'symp_1',
    userId: 'user_patient_1',
    patientName: 'Sarah Jenkins',
    symptoms: ['Mild Headache', 'Eye Fatigue', 'Neck Tightness'],
    duration: '2 Days',
    severity: 'Mild',
    triageLevel: 'low',
    score: 25,
    analysis: 'Symptoms are consistent with tension headache or digital eye strain. No acute neurological danger flagged.',
    recommendedActions: [
      'Maintain hydrations (2.5L water daily)',
      'Apply 20-20-20 rule during screen work',
      'Take over-the-counter mild analgesics if discomfort persists'
    ],
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'symp_2',
    userId: 'user_patient_2',
    patientName: 'John Doe',
    symptoms: ['Chest Tightness', 'Shortness of Breath', 'Dizziness'],
    duration: '3 Hours',
    severity: 'Severe',
    triageLevel: 'emergency',
    score: 92,
    analysis: 'CRITICAL WARNING: Symptoms strongly correlate with acute cardiovascular distress or angina. Immediate clinical intervention required.',
    recommendedActions: [
      'CALL EMERGENCY SERVICES (911/112) IMMEDIATELY',
      'Rest in a sitting position, avoid physical exertion',
      'Alert primary emergency contact'
    ],
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    _id: 'symp_3',
    userId: 'user_patient_3',
    patientName: 'Elena Rodriguez',
    symptoms: ['Persistent Cough', 'Low Fever', 'Fatigue'],
    duration: '4 Days',
    severity: 'Moderate',
    triageLevel: 'medium',
    score: 55,
    analysis: 'Clinical indicators point to upper respiratory tract infection. Monitor body temperature and resting oxygen levels.',
    recommendedActions: [
      'Schedule telehealth review with General Practitioner',
      'Monitor oxygen saturation (SpO2)',
      'Rest and increase vitamin C & zinc intake'
    ],
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

const initialPrescriptions = [
  {
    _id: 'rx_1',
    userId: 'user_patient_1',
    patientName: 'Sarah Jenkins',
    medication: 'Metoprolol Succinate',
    dosage: '25 mg',
    frequency: 'Once Daily (Morning)',
    duration: '90 Days',
    refillsLeft: 2,
    prescribingDoctor: 'Dr. Marcus Chen',
    instructions: 'Take with food or immediately after meals.',
    status: 'Active',
    issuedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    _id: 'rx_2',
    userId: 'user_patient_1',
    patientName: 'Sarah Jenkins',
    medication: 'Vitamin D3 (Cholecalciferol)',
    dosage: '5000 IU',
    frequency: 'Once Daily with fat-containing meal',
    duration: '60 Days',
    refillsLeft: 3,
    prescribingDoctor: 'Dr. Emily Carter',
    instructions: 'Dietary supplement for optimal bone and immune function.',
    status: 'Active',
    issuedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    _id: 'rx_3',
    userId: 'user_patient_2',
    patientName: 'John Doe',
    medication: 'Metformin HCl',
    dosage: '500 mg',
    frequency: 'Twice Daily (Breakfast & Dinner)',
    duration: '180 Days',
    refillsLeft: 5,
    prescribingDoctor: 'Dr. Sophia Sterling',
    instructions: 'Glycemic control management.',
    status: 'Active',
    issuedDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
];

const initialDoctors = [
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

const initialWellness = [
  {
    id: 'tip_1',
    title: 'Anulom Vilom (Alternate Nostril Pranayama)',
    category: 'Yoga & Breathing',
    difficulty: 'Gentle',
    duration: '5 - 10 Mins',
    iconName: 'Wind',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80',
    steps: [
      'Sit comfortably with spine erect and shoulders relaxed.',
      'Place right thumb on right nostril, inhale deeply through left nostril for 4 counts.',
      'Close left nostril with ring finger, release thumb and exhale smoothly through right nostril for 4 counts.',
      'Inhale through right nostril, close right, and exhale through left. Repeat cycle 10-15 times.'
    ],
    benefit: 'Stimulates parasympathetic vagal nerve response, lowers systolic blood pressure, and reduces cortisol stress levels.'
  },
  {
    id: 'tip_2',
    title: 'Bhujangasana (Cobra Pose for Spine & Chest)',
    category: 'Yoga Asana',
    difficulty: 'Beginner',
    duration: '3 Sets x 30 Secs',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=80',
    steps: [
      'Lie face down with legs extended and palms placed under shoulders.',
      'Inhale and slowly lift chest off the mat by straightening arms gently, keeping elbows slightly bent.',
      'Keep shoulders drawn back away from ears and gaze gently upwards.',
      'Hold position while breathing rhythmically for 20-30 seconds, then lower gracefully.'
    ],
    benefit: 'Expands thoracic lung capacity, relieves lumbar spine compression, and improves posture.'
  },
  {
    id: 'tip_3',
    title: 'Vrikshasana (Tree Pose for Balance & Focus)',
    category: 'Yoga Asana',
    difficulty: 'Intermediate',
    duration: '1 Min per Leg',
    iconName: 'Heart',
    image: 'https://images.unsplash.com/photo-1510894347713-da3ed8f4f92d?auto=format&fit=crop&w=500&q=80',
    steps: [
      'Stand upright, shift weight onto left leg.',
      'Place right foot sole high onto inner left thigh (avoiding knee joint).',
      'Bring palms together in Namaste at chest center or raise overhead.',
      'Focus gaze on a stationary point 5 feet ahead to maintain equilibrium for 60 seconds.'
    ],
    benefit: 'Strengthens neuromuscular ankle stability, core balance, and mental concentration.'
  },
  {
    id: 'tip_4',
    title: 'Shavasana (Corpse Pose & Deep Autonomic Rest)',
    category: 'Mindfulness',
    difficulty: 'Restorative',
    duration: '10 Mins Evening',
    iconName: 'Moon',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80',
    steps: [
      'Lie completely flat on back with legs comfortably apart and arms relaxed at sides, palms facing up.',
      'Close eyes and take 3 deep belly breaths, releasing all muscle tension from toes upward.',
      'Allow thoughts to pass without judgment, resting awareness on calm rising chest.'
    ],
    benefit: 'Triggers deep parasympathetic recovery, reduces resting heart rate, and improves sleep latency.'
  },
  {
    id: 'tip_5',
    title: '2.5L Daily Hydration & Electrolyte Protocol',
    category: 'Nutrition & Hydration',
    difficulty: 'Daily Habit',
    duration: 'All Day',
    iconName: 'Droplet',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=500&q=80',
    steps: [
      'Drink 500ml room temperature water immediately upon waking.',
      'Maintain 250ml water intake every 2 hours until 8:00 PM.',
      'Add a squeeze of fresh lemon and pinch of mineral sea salt for natural electrolyte absorption.'
    ],
    benefit: 'Prevents vascular hemoconcentration, maintains kidney filtration rate, and supports optimal joint lubrication.'
  },
  {
    id: 'tip_6',
    title: 'Circadian Sleep & Blue Light Shutdown',
    category: 'Sleep Optimization',
    difficulty: 'Daily Habit',
    duration: '7.5 Hours Nightly',
    iconName: 'Sun',
    image: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=500&q=80',
    steps: [
      'Turn off digital screens 60 minutes prior to planned bedtime.',
      'Maintain bedroom ambient temperature between 18-20°C (64-68°F).',
      'Expose eyes to natural morning sunlight within 30 minutes of waking to anchor circadian rhythm.'
    ],
    benefit: 'Optimizes natural melatonin secretion, enhances slow-wave delta sleep, and boosts glucose insulin sensitivity.'
  }
];

class MemoryStore {
  constructor() {
    this.users = [...initialUsers];
    this.vitals = [...initialVitals];
    this.appointments = [...initialAppointments];
    this.symptomChecks = [...initialSymptomChecks];
    this.prescriptions = [...initialPrescriptions];
    this.doctors = [...initialDoctors];
    this.wellness = [...initialWellness];
  }

  // Wellness & Yoga Management
  getAllWellness() {
    return [...this.wellness];
  }

  addWellness(tipObj) {
    const newTip = {
      id: `tip_${Date.now()}`,
      category: tipObj.category || 'Yoga Asana',
      difficulty: tipObj.difficulty || 'Beginner',
      duration: tipObj.duration || '10 Mins',
      iconName: tipObj.iconName || 'Sparkles',
      image: tipObj.image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80',
      steps: Array.isArray(tipObj.steps) ? tipObj.steps : [tipObj.steps || 'Follow standard clinical practice.'],
      benefit: tipObj.benefit || 'Enhances metabolic stability, reduces stress, and improves vitality.',
      ...tipObj
    };
    this.wellness.push(newTip);
    return newTip;
  }

  deleteWellness(id) {
    const initialLen = this.wellness.length;
    this.wellness = this.wellness.filter(w => w.id !== id && w._id !== id);
    return this.wellness.length < initialLen;
  }

  // Doctors Roster Management
  getAllDoctors() {
    return [...this.doctors];
  }

  addDoctor(docObj) {
    const newDoc = {
      id: `doc_${Date.now()}`,
      rating: '5.0',
      reviewsCount: 12,
      experience: docObj.experience || '10+ Years Exp',
      status: docObj.status || 'Available Today',
      statusType: docObj.statusType || 'available',
      nextSlot: docObj.nextSlot || '09:00 AM',
      slots: docObj.slots || ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      ...docObj
    };
    this.doctors.push(newDoc);
    return newDoc;
  }

  deleteDoctor(id) {
    const initialLen = this.doctors.length;
    this.doctors = this.doctors.filter(d => d.id !== id && d._id !== id);
    return this.doctors.length < initialLen;
  }

  // User operations
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  addUser(userObj) {
    const newUser = {
      _id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      role: 'patient',
      ...userObj
    };
    this.users.push(newUser);
    return newUser;
  }

  getAllPatients() {
    return this.users
      .filter(u => u.role === 'patient')
      .map(({ password, ...rest }) => rest);
  }

  // Vitals operations
  getVitalsForUser(userId) {
    return this.vitals
      .filter(v => v.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  addVitals(vitalObj) {
    const newVital = {
      _id: `vital_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...vitalObj
    };
    this.vitals.push(newVital);
    return newVital;
  }

  // Appointments operations
  getAppointmentsForUser(userId) {
    return this.appointments
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getAllAppointments() {
    return [...this.appointments].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  addAppointment(apptObj) {
    const newAppt = {
      _id: `appt_${Date.now()}`,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      ...apptObj
    };
    this.appointments.push(newAppt);
    return newAppt;
  }

  updateAppointmentStatus(id, status) {
    const appt = this.appointments.find(a => a._id === id);
    if (appt) {
      appt.status = status;
      return appt;
    }
    return null;
  }

  // Symptom Checks operations
  getSymptomChecksForUser(userId) {
    return this.symptomChecks
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getAllSymptomChecks() {
    return [...this.symptomChecks].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  addSymptomCheck(checkObj) {
    const newCheck = {
      _id: `symp_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...checkObj
    };
    this.symptomChecks.push(newCheck);
    return newCheck;
  }

  // Prescriptions operations
  getPrescriptionsForUser(userId) {
    return this.prescriptions.filter(p => p.userId === userId);
  }

  getAllPrescriptions() {
    return [...this.prescriptions];
  }
}

const memoryStoreInstance = new MemoryStore();

module.exports = memoryStoreInstance;
