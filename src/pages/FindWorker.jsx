import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, MapPin, Star, ShieldCheck, Phone, 
  Calendar, ArrowRight, Sparkles, Wrench, Plus, CheckCircle2,
  Clock, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WORKER_CATEGORIES } from '../data/mockWorkers';
import RegisterWorkerModal from '../components/worker/RegisterWorkerModal';
import BookWorkerModal from '../components/worker/BookWorkerModal';

const WAGHOLI_WARDS = [
  { id: 'ALL', name: 'All Wagholi Wards' },
  { id: 'Ward 28', name: 'Ward 28 (Ivy Estate / Pune-Nagar Hwy)' },
  { id: 'Ward 29', name: 'Ward 29 (Kesnand Rd & Raisoni Chowk)' },
  { id: 'Ward 27', name: 'Ward 27 (Baif Road / Central Wagholi)' },
  { id: 'Ward 30', name: 'Ward 30 (Domkhel Road & Ubale Nagar)' },
  { id: 'Ward 31', name: 'Ward 31 (Bakori Road & Wagheshwar)' }
];

export default function FindWorker() {
  const { workers = [], currentWorkerProfile } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Filter workers
  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      // Category filter
      if (selectedCategory !== 'ALL' && w.category !== selectedCategory) {
        return false;
      }
      // Ward filter
      if (selectedWard !== 'ALL' && !w.ward.includes(selectedWard)) {
        return false;
      }
      // Availability filter
      if (availableOnly && w.availability !== 'AVAILABLE') {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (w.name || '').toLowerCase().includes(q);
        const matchesCategory = (w.category || '').toLowerCase().includes(q);
        const matchesWard = (w.ward || '').toLowerCase().includes(q);
        const matchesSkill = (w.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCategory && !matchesWard && !matchesSkill) {
          return false;
        }
      }
      return true;
    });
  }, [workers, selectedCategory, selectedWard, availableOnly, searchQuery]);

  const handleOpenBooking = (worker) => {
    setSelectedWorkerForBooking(worker);
    setIsBookModalOpen(true);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', background: '#F8FAFC', paddingBottom: '70px' }}>
      
      {/* ── Top Hero Header ── */}
      <div className="container" style={{ paddingTop: '28px' }}>
        <div style={{
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 60%, #047857 100%)',
          color: '#FFFFFF',
          padding: 'clamp(20px, 4vw, 36px)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(6, 78, 59, 0.15)'
        }}>
          {/* Subtle background ambient graphic */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-40px',
            width: '240px', height: '240px', borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)', pointerEvents: 'none'
          }} />

          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1
          }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)',
                borderRadius: '999px', padding: '3px 12px', marginBottom: '12px'
              }}>
                <Sparkles style={{ width: '13px', height: '13px', color: '#6EE7B7' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#A7F3D0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Jan_Sahayak Wagholi Workforce
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.25 }}>
                Find Verified Local Technicians
              </h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#D1FAE5', maxWidth: '580px', lineHeight: 1.5 }}>
                Book skilled plumbers, electricians, road masons, and sanitation workers verified by PMC and vetted by Wagholi residents.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                style={{
                  height: '42px', padding: '0 18px', borderRadius: '12px',
                  background: '#FFFFFF', color: '#065F46', border: 'none',
                  fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                <span>Register as Worker</span>
              </button>

              <Link
                to="/worker"
                style={{
                  height: '42px', padding: '0 18px', borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.18)', color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 700, fontSize: '13px', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <Wrench style={{ width: '16px', height: '16px' }} />
                <span>Worker Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filters Section ── */}
      <div className="container" style={{ paddingTop: '20px' }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '18px',
          padding: '16px',
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
          marginBottom: '20px'
        }}>
          {/* Search bar + Ward dropdown + Available toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '14px'
          }}>
            {/* Search Input */}
            <div style={{
              flex: '1 1 260px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                width: '16px',
                height: '16px',
                color: '#94A3B8'
              }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by technician name, skill (e.g. pipe repair, wiring)..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Ward Select */}
            <div style={{ flex: '0 1 220px' }}>
              <select
                value={selectedWard}
                onChange={e => setSelectedWard(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: '#FFFFFF',
                  color: '#334155'
                }}
              >
                {WAGHOLI_WARDS.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            {/* Available Now Toggle Button */}
            <button
              type="button"
              onClick={() => setAvailableOnly(!availableOnly)}
              style={{
                height: '40px',
                padding: '0 14px',
                borderRadius: '10px',
                border: availableOnly ? '2px solid #16A34A' : '1px solid #CBD5E1',
                background: availableOnly ? '#DCFCE7' : '#FFFFFF',
                color: availableOnly ? '#15803D' : '#475569',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: availableOnly ? '#16A34A' : '#94A3B8'
              }} />
              <span>Available Now</span>
            </button>
          </div>

          {/* Trade Category Filter Pills */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}>
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: selectedCategory === 'ALL' ? '2px solid #065F46' : '1px solid #E2E8F0',
                background: selectedCategory === 'ALL' ? '#ECFDF5' : '#F8FAFC',
                color: selectedCategory === 'ALL' ? '#065F46' : '#475569',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              All Trades ({workers.length})
            </button>

            {WORKER_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              const count = workers.filter(w => w.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: isSelected ? '2px solid #065F46' : '1px solid #E2E8F0',
                    background: isSelected ? '#ECFDF5' : '#F8FAFC',
                    color: isSelected ? '#065F46' : '#475569',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Workers Result Grid ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>
            Showing {filteredWorkers.length} verified technician{filteredWorkers.length === 1 ? '' : 's'} in Wagholi
          </div>
          {currentWorkerProfile && (
            <span style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>
              Logged in as registered technician ({currentWorkerProfile.name})
            </span>
          )}
        </div>

        {filteredWorkers.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '48px 24px',
            textAlign: 'center'
          }}>
            <Wrench style={{ width: '40px', height: '40px', color: '#94A3B8', margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>
              No technicians found
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B' }}>
              Try adjusting your category, ward, or search filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedWard('ALL');
                setAvailableOnly(false);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#065F46',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px'
          }}>
            {filteredWorkers.map(worker => {
              const catObj = WORKER_CATEGORIES.find(c => c.id === worker.category) || {
                name: worker.category,
                icon: '🔧'
              };
              const isAvailable = worker.availability === 'AVAILABLE';

              return (
                <div
                  key={worker.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(15, 23, 42, 0.09)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '0 4px 16px -2px rgba(15, 23, 42, 0.04)';
                  }}
                >
                  <div>
                    {/* Top Row: Avatar + Name + Availability */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={worker.avatar}
                          alt={worker.name}
                          style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #E2E8F0'
                          }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                              {worker.name}
                            </h3>
                            {worker.isVerified && (
                              <span title="PMC Verified Partner" style={{ color: '#16A34A', display: 'inline-flex' }}>
                                <ShieldCheck style={{ width: '16px', height: '16px' }} />
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <span>{catObj.icon} {catObj.name}</span>
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: isAvailable ? '#DCFCE7' : '#FEF3C7',
                        color: isAvailable ? '#15803D' : '#B45309',
                        whiteSpace: 'nowrap'
                      }}>
                        {isAvailable ? 'AVAILABLE' : 'BUSY ON JOB'}
                      </span>
                    </div>

                    {/* Ward & Distance */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12px',
                      color: '#475569',
                      marginBottom: '10px'
                    }}>
                      <MapPin style={{ width: '13px', height: '13px', color: '#065F46', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {worker.ward}
                      </span>
                    </div>

                    {/* Metric Row: Rating + Jobs + Experience */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      padding: '8px 10px',
                      marginBottom: '12px',
                      textAlign: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Rating</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                          ⭐ {worker.rating}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Completed</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                          {worker.completedJobs} jobs
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Experience</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                          {worker.experienceYears} yrs
                        </div>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {worker.skills?.map((skill, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '11px',
                            background: '#F1F5F9',
                            color: '#334155',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 500
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Booking Footer */}
                  <div style={{
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}>
                    <div>
                      <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Est. Base Rate</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#065F46', fontFamily: 'monospace' }}>
                        ₹{worker.baseFarePerHour}<span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>/hr</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={`tel:${worker.phone}`}
                        title="Call technician"
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          border: '1px solid #CBD5E1',
                          background: '#FFFFFF',
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none'
                        }}
                      >
                        <Phone style={{ width: '15px', height: '15px' }} />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleOpenBooking(worker)}
                        style={{
                          height: '38px',
                          padding: '0 16px',
                          borderRadius: '10px',
                          border: 'none',
                          background: '#065F46',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '12.5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(6, 78, 59, 0.25)'
                        }}
                      >
                        <span>Book Service</span>
                        <ArrowRight style={{ width: '13px', height: '13px' }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <RegisterWorkerModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => setIsRegisterModalOpen(false)}
      />

      {selectedWorkerForBooking && (
        <BookWorkerModal
          worker={selectedWorkerForBooking}
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          onSuccess={() => setIsBookModalOpen(false)}
        />
      )}
    </div>
  );
}
