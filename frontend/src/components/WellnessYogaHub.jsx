import React, { useState, useEffect } from 'react';
import { Heart, Activity, Droplet, Moon, Sun, Wind, Sparkles, CheckCircle2, Flame, Award, BookOpen, Clock, Trash2, Plus, Lock, UserPlus } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { PillChip } from './PillChip';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export const YOGA_HEALTH_TIPS = [
  {
    id: 'tip_1',
    title: 'Anulom Vilom (Alternate Nostril Pranayama)',
    category: 'Yoga & Breathing',
    difficulty: 'Gentle',
    duration: '5 - 10 Mins',
    icon: Wind,
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
    icon: Activity,
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
    icon: Heart,
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
    icon: Moon,
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
    icon: Droplet,
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
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=500&q=80',
    steps: [
      'Turn off digital screens 60 minutes prior to planned bedtime.',
      'Maintain bedroom ambient temperature between 18-20°C (64-68°F).',
      'Expose eyes to natural morning sunlight within 30 minutes of waking to anchor circadian rhythm.'
    ],
    benefit: 'Optimizes natural melatonin secretion, enhances slow-wave delta sleep, and boosts glucose insulin sensitivity.'
  }
];

export const WellnessYogaHub = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [tipsList, setTipsList] = useState(YOGA_HEALTH_TIPS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [completedTips, setCompletedTips] = useState([]);
  const [activeModalTip, setActiveModalTip] = useState(null);

  // Admin Add Tip Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newTip, setNewTip] = useState({
    title: '',
    category: 'Yoga Asana',
    duration: '10 Mins',
    difficulty: 'Beginner',
    benefit: '',
    steps: '',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80'
  });

  const fetchTips = () => {
    apiService.getWellnessTips()
      .then(res => {
        if (res && res.length > 0) {
          const formatted = res.map(item => ({
            ...item,
            icon: item.category.toLowerCase().includes('yoga') ? Activity : item.category.toLowerCase().includes('breath') ? Wind : item.category.toLowerCase().includes('sleep') ? Moon : Sparkles
          }));
          setTipsList(formatted);
        }
      })
      .catch(err => console.error('Failed to fetch wellness tips:', err));
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const toggleComplete = (id) => {
    if (completedTips.includes(id)) {
      setCompletedTips(completedTips.filter(item => item !== id));
    } else {
      setCompletedTips([...completedTips, id]);
    }
  };

  // Admin Permission: Add New Wellness & Yoga Practice
  const handleAddTipSubmit = async (e) => {
    e.preventDefault();
    if (!newTip.title || !newTip.category) {
      alert('Please provide Title and Category.');
      return;
    }
    setAddLoading(true);
    try {
      await apiService.addWellnessTip({
        ...newTip,
        steps: newTip.steps ? newTip.steps.split('\n').filter(Boolean) : ['Follow standard clinical practice.']
      });
      alert(`Success: ${newTip.title} has been added to the system wellness guide!`);
      setIsAddModalOpen(false);
      setNewTip({
        title: '',
        category: 'Yoga Asana',
        duration: '10 Mins',
        difficulty: 'Beginner',
        benefit: '',
        steps: '',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80'
      });
      fetchTips();
    } catch (err) {
      alert(err.message || 'Failed to add wellness tip.');
    } finally {
      setAddLoading(false);
    }
  };

  // Admin Permission: Remove Wellness & Yoga Practice
  const handleDeleteTip = async (tip) => {
    const tipId = tip.id || tip._id;
    if (!window.confirm(`Admin Permission Confirmation: Delete "${tip.title}" from system?`)) {
      return;
    }
    try {
      await apiService.deleteWellnessTip(tipId);
      alert(`Success: "${tip.title}" removed successfully.`);
      fetchTips();
    } catch (err) {
      alert(err.message || 'Failed to delete tip.');
    }
  };

  const filteredTips = tipsList.filter(tip => {
    if (selectedCategory === 'All') return true;
    return (tip.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 28px 60px 28px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px 32px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(11, 19, 43, 0.95) 100%)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10B981' }}>
                <Sparkles size={24} color="#10B981" />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFF' }}>
                Holistic Health & Yoga Wellness Hub
              </h2>
              {isAdmin && (
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#10B981', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> Admin Permissions Active
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Clinical Yoga Asanas, Pranayama Breathing, Hydration & Circadian Sleep Protocol
            </p>
          </div>

          {/* Admin Add Trigger or Patient Tracker Widget */}
          {isAdmin ? (
            <button onClick={() => setIsAddModalOpen(true)} className="btn-lime" style={{ fontSize: '0.9rem', padding: '12px 22px' }}>
              <Plus size={18} /> + Add New Yoga / Wellness Tip
            </button>
          ) : (
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', padding: '12px 20px', borderRadius: '16px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily Practice Tracker</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#A3E635' }}>
                {completedTips.length} / {tipsList.length} Completed
              </div>
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          <PillChip label="All Wellness" active={selectedCategory === 'All'} onClick={() => setSelectedCategory('All')} count={tipsList.length} />
          <PillChip label="Yoga & Asanas" active={selectedCategory === 'Yoga'} onClick={() => setSelectedCategory('Yoga')} />
          <PillChip label="Mindfulness" active={selectedCategory === 'Mindfulness'} onClick={() => setSelectedCategory('Mindfulness')} />
          <PillChip label="Hydration" active={selectedCategory === 'Hydration'} onClick={() => setSelectedCategory('Hydration')} />
          <PillChip label="Sleep Optimization" active={selectedCategory === 'Sleep'} onClick={() => setSelectedCategory('Sleep')} />
        </div>
      </div>

      {/* Grid of Healthy Tips & Yoga Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {filteredTips.map((tip) => {
          const IconComponent = tip.icon || Sparkles;
          const isDone = completedTips.includes(tip.id);

          return (
            <GlassCard key={tip.id || tip._id} interactive style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
              
              {/* Card Image Banner */}
              <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                <img
                  src={tip.image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80'}
                  alt={tip.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(to top, rgba(11, 19, 43, 0.95) 0%, transparent 70%)'
                }} />
                
                {/* Category Badge */}
                <span style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  background: 'rgba(7, 13, 30, 0.8)',
                  border: '1px solid #A3E635',
                  color: '#A3E635',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                  textTransform: 'uppercase'
                }}>
                  {tip.category}
                </span>

                {/* Duration Tag */}
                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '14px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: '#FFF',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Clock size={12} color="#A3E635" /> {tip.duration}
                </span>
              </div>

              {/* Card Body Content */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ padding: '6px', borderRadius: '10px', background: 'rgba(163, 230, 53, 0.15)' }}>
                    <IconComponent size={18} color="#A3E635" />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFF' }}>{tip.title}</h3>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: '1.45', marginBottom: '14px' }}>
                  <strong>Health Benefit:</strong> {tip.benefit}
                </p>

                {/* Action Controls */}
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
                  <button
                    onClick={() => setActiveModalTip(tip)}
                    className="btn-glass"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}
                  >
                    <BookOpen size={14} /> Practice Guide
                  </button>

                  {isAdmin ? (
                    <button
                      onClick={() => handleDeleteTip(tip)}
                      className="btn-danger"
                      style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                      title="Admin Permission: Remove Tip"
                    >
                      <Trash2 size={15} /> Delete Tip
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleComplete(tip.id)}
                      className={isDone ? 'btn-lime' : 'btn-glass'}
                      style={{
                        padding: '8px 14px',
                        fontSize: '0.8rem',
                        borderColor: isDone ? '#A3E635' : undefined,
                        color: isDone ? '#070D1E' : '#FFF'
                      }}
                    >
                      <CheckCircle2 size={15} /> {isDone ? 'Completed' : 'Mark Done'}
                    </button>
                  )}
                </div>

              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* ADMIN ADD WELLNESS TIP MODAL */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(7, 13, 30, 0.88)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '30px', border: '1px solid #10B981' }}>
            
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
              <button onClick={() => setIsAddModalOpen(false)} className="btn-glass" style={{ padding: '6px 12px' }}>Close</button>
            </div>

            <form onSubmit={handleAddTipSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Practice Title *</label>
                <input
                  type="text"
                  required
                  className="input-glass"
                  placeholder="e.g. Surya Namaskar (Sun Salutation)"
                  value={newTip.title}
                  onChange={e => setNewTip({ ...newTip, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Category *</label>
                  <select
                    className="input-glass"
                    value={newTip.category}
                    onChange={e => setNewTip({ ...newTip, category: e.target.value })}
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
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Duration / Reps</label>
                  <input
                    type="text"
                    className="input-glass"
                    placeholder="e.g. 10 Mins Morning"
                    value={newTip.duration}
                    onChange={e => setNewTip({ ...newTip, duration: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Clinical Health Benefit</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="e.g. Lowers blood pressure, improves spinal elasticity, and reduces anxiety."
                  value={newTip.benefit}
                  onChange={e => setNewTip({ ...newTip, benefit: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Step-by-Step Instructions (One per line)</label>
                <textarea
                  className="input-glass"
                  rows={4}
                  placeholder="Step 1: Stand in Pranamasana...\nStep 2: Raise arms in Hasta Uttanasana..."
                  value={newTip.steps}
                  onChange={e => setNewTip({ ...newTip, steps: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>Image URL</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="https://..."
                  value={newTip.image}
                  onChange={e => setNewTip({ ...newTip, image: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-glass" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" disabled={addLoading} className="btn-lime" style={{ flex: 1, justifyContent: 'center' }}>
                  {addLoading ? 'Saving Practice...' : 'Publish Wellness Practice'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Practice Guide Instructions Modal */}
      {activeModalTip && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(7, 13, 30, 0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '28px', border: '1px solid #10B981' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: '800', textTransform: 'uppercase' }}>{activeModalTip.category}</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFF', marginTop: '2px' }}>{activeModalTip.title}</h3>
              </div>
              <button onClick={() => setActiveModalTip(null)} className="btn-glass" style={{ padding: '6px 12px' }}>Close</button>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', padding: '12px 16px', borderRadius: '12px', marginBottom: '18px', fontSize: '0.88rem', color: '#FFF' }}>
              <strong>Clinical Health Impact:</strong> {activeModalTip.benefit}
            </div>

            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '700' }}>
              Step-by-Step Execution Guide:
            </h4>

            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {Array.isArray(activeModalTip.steps) ? (
                activeModalTip.steps.map((step, idx) => (
                  <li key={idx} style={{ lineHeight: '1.5' }}>{step}</li>
                ))
              ) : (
                <li style={{ lineHeight: '1.5' }}>{activeModalTip.steps}</li>
              )}
            </ol>

            <button onClick={() => setActiveModalTip(null)} className="btn-lime" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              Close Practice Guide
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
