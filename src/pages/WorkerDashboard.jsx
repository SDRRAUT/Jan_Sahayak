import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, CheckCircle2, Clock, Phone, MapPin, 
  IndianRupee, AlertCircle, ShieldCheck, Star, 
  Sparkles, Check, X, ArrowRight, UserCheck, 
  Calendar, Layers, Filter, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WORKER_CATEGORIES } from '../data/mockWorkers';
import RegisterWorkerModal from '../components/worker/RegisterWorkerModal';

export default function WorkerDashboard() {
  const { 
    user,
    currentWorkerProfile, 
    workerOrders = [], 
    updateWorkerAvailability,
    acceptWorkerOrder,
    startWorkerOrder,
    completeWorkerOrder,
    settleWorkerPayment,
    rejectWorkerOrder,
    registerAsWorker
  } = useApp();

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'active' | 'completed' | 'profile'
  const [completionNotes, setCompletionNotes] = useState('Pipe leak sealed with PMC grade HDPE clamp, pressure tested to 3 bar.');
  const [completingOrderId, setCompletingOrderId] = useState(null);

  // Filter orders relevant to this worker
  const myOrders = useMemo(() => {
    if (!currentWorkerProfile) return [];
    return workerOrders.filter(o => 
      o.workerId === currentWorkerProfile.id || 
      (o.workerName && currentWorkerProfile.name && o.workerName.toLowerCase() === currentWorkerProfile.name.toLowerCase())
    );
  }, [workerOrders, currentWorkerProfile]);

  const incomingRequests = myOrders.filter(o => o.status === 'REQUESTED' || o.status === 'BOOKED');
  const activeOrders = myOrders.filter(o => o.status === 'ACCEPTED' || o.status === 'IN_PROGRESS');
  const completedOrders = myOrders.filter(o => o.status === 'COMPLETED' || o.status === 'PAID' || o.status === 'CLOSED');

  // Total earnings calculated from completed and paid orders
  const totalEarnings = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + (Number(o.estimatedFare) || 0), 0);
  }, [completedOrders]);

  // Handle availability toggle
  const handleToggleAvailability = (newStatus) => {
    if (currentWorkerProfile) {
      updateWorkerAvailability(currentWorkerProfile.id, newStatus);
    }
  };

  // Quick helper to prefill and register demo worker if user wants instant preview
  const handleQuickDemoRegistration = () => {
    registerAsWorker({
      name: user?.name || 'Rahul Raut (Technician)',
      phone: user?.phone || '+91 98234 56789',
      ward: 'Ward 28 - Ivy Estate / Pune-Nagar Hwy',
      category: 'plumbing',
      skills: ['Pipe Repair', 'HDPE Welding', 'Motor Overhaul', 'Leak Detection'],
      experienceYears: 6,
      baseFarePerHour: 250,
      verificationType: 'PMC Enrolled Contractor',
      verificationId: 'PMC-WAG-TECH-8824',
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      availability: 'AVAILABLE'
    });
  };

  // If citizen hasn't registered as worker yet
  if (!currentWorkerProfile) {
    return (
      <div style={{ minHeight: 'calc(100vh - 72px)', background: '#F8FAFC', paddingBottom: '70px' }}>
        <div className="container" style={{ paddingTop: '40px', maxWidth: '800px' }}>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: 'clamp(24px, 5vw, 44px)',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: '#ECFDF5',
              color: '#065F46',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '1px solid #A7F3D0'
            }}>
              <Wrench style={{ width: '36px', height: '36px' }} />
            </div>

            <h1 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>
              Jan_Sahayak Wagholi Worker Portal
            </h1>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 24px' }}>
              Join Wagholi’s verified civic technician network. Receive direct paid service orders from local citizens and government field officers without middleman commissions.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              textAlign: 'left',
              marginBottom: '32px'
            }}>
              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                  ⚡ Instant Direct Orders
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Get real-time booking alerts when residents or PMC engineers need repairs in your ward.
                </div>
              </div>

              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                  💰 Transparent Dynamic Fares
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Fair distance and duration pricing with automatic priority surges for emergency jobs.
                </div>
              </div>

              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                  🏛️ PMC Municipal Dispatch
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Direct institutional contracting for grievance resolution across Wagholi wards.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#065F46',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(6, 78, 59, 0.25)'
                }}
              >
                <span>Register as Worker Profile</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>

              <button
                type="button"
                onClick={handleQuickDemoRegistration}
                style={{
                  padding: '12px 22px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                1-Click Quick Demo Profile
              </button>
            </div>
          </div>
        </div>

        <RegisterWorkerModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSuccess={() => setIsRegisterModalOpen(false)}
        />
      </div>
    );
  }

  const categoryObj = WORKER_CATEGORIES.find(c => c.id === currentWorkerProfile.category) || {
    name: currentWorkerProfile.category,
    icon: '🔧'
  };

  const isAvailable = currentWorkerProfile.availability === 'AVAILABLE';
  const isBusy = currentWorkerProfile.availability === 'BUSY';
  const isOffline = currentWorkerProfile.availability === 'OFFLINE';

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', background: '#F8FAFC', paddingBottom: '70px' }}>
      
      {/* ── Top Worker Profile & Status Banner ── */}
      <div className="container" style={{ paddingTop: '24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #ECFDF5 100%)',
          border: '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: 'clamp(20px, 4vw, 32px)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px'
          }}>
            {/* Left: Avatar + Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={currentWorkerProfile.avatar}
                alt={currentWorkerProfile.name}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #065F46',
                  boxShadow: '0 4px 12px rgba(6, 78, 59, 0.15)'
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ margin: 0, fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 800, color: '#0F172A' }}>
                    {currentWorkerProfile.name}
                  </h1>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#065F46',
                    background: '#D1FAE5',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ShieldCheck style={{ width: '13px', height: '13px' }} />
                    PMC Partner
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>
                    {categoryObj.icon} {categoryObj.name}
                  </span>
                  <span>·</span>
                  <span>⭐ {currentWorkerProfile.rating || 4.9} Rating</span>
                  <span>·</span>
                  <span>{currentWorkerProfile.experienceYears || 5} Years Exp</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
                  <MapPin style={{ width: '13px', height: '13px', color: '#065F46' }} />
                  <span>{currentWorkerProfile.ward}</span>
                  <span>·</span>
                  <span>Rate: ₹{currentWorkerProfile.baseFarePerHour}/hr</span>
                </div>
              </div>
            </div>

            {/* Right: Availability Switcher */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '16px',
              padding: '8px 12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>
                Availability Status
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleToggleAvailability('AVAILABLE')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: isAvailable ? '2px solid #16A34A' : '1px solid #E2E8F0',
                    background: isAvailable ? '#DCFCE7' : '#F8FAFC',
                    color: isAvailable ? '#15803D' : '#64748B',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  🟢 Available
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleAvailability('BUSY')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: isBusy ? '2px solid #D97706' : '1px solid #E2E8F0',
                    background: isBusy ? '#FEF3C7' : '#F8FAFC',
                    color: isBusy ? '#B45309' : '#64748B',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  🟡 Busy on Job
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleAvailability('OFFLINE')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: isOffline ? '2px solid #64748B' : '1px solid #E2E8F0',
                    background: isOffline ? '#F1F5F9' : '#F8FAFC',
                    color: isOffline ? '#334155' : '#64748B',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  ⚪ Offline
                </button>
              </div>
            </div>
          </div>

          {/* KPI Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginTop: '24px'
          }}>
            {[
              { label: 'Total Earnings', value: `₹${totalEarnings}`, col: '#065F46', bg: '#ECFDF5' },
              { label: 'Incoming Requests', value: incomingRequests.length, col: '#2563EB', bg: '#EFF6FF' },
              { label: 'Active Jobs', value: activeOrders.length, col: '#D97706', bg: '#FFFBEB' },
              { label: 'Completed Jobs', value: completedOrders.length, col: '#7C3AED', bg: '#F5F3FF' }
            ].map(kpi => (
              <div
                key={kpi.label}
                style={{
                  background: kpi.bg,
                  borderRadius: '14px',
                  padding: '12px 14px',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: kpi.col, textTransform: 'uppercase', marginBottom: '2px' }}>
                  {kpi.label}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sub Navigation Tabs ── */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '12px',
          marginBottom: '20px',
          overflowX: 'auto'
        }}>
          {[
            { key: 'incoming', label: `Incoming Requests (${incomingRequests.length})`, count: incomingRequests.length },
            { key: 'active', label: `Active Work (${activeOrders.length})`, count: activeOrders.length },
            { key: 'completed', label: `Completed & Earnings (${completedOrders.length})`, count: completedOrders.length }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: activeTab === tab.key ? '2px solid #065F46' : '1px solid #CBD5E1',
                background: activeTab === tab.key ? '#ECFDF5' : '#FFFFFF',
                color: activeTab === tab.key ? '#065F46' : '#475569',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}

        {/* 1. INCOMING REQUESTS */}
        {activeTab === 'incoming' && (
          <div>
            {incomingRequests.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '48px 24px',
                textAlign: 'center'
              }}>
                <Clock style={{ width: '38px', height: '38px', color: '#94A3B8', margin: '0 auto 12px' }} />
                <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>
                  No Incoming Requests Right Now
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                  Your status is set to {currentWorkerProfile.availability}. You will receive a direct notification when a citizen or officer books you.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {incomingRequests.map(order => {
                  const isGovt = order.requestedBy === 'GOVERNMENT_OFFICER';
                  return (
                    <div
                      key={order.id}
                      style={{
                        background: '#FFFFFF',
                        border: isGovt ? '2px solid #86EFAC' : '1px solid #E2E8F0',
                        borderRadius: '20px',
                        padding: '20px',
                        boxShadow: '0 4px 18px -2px rgba(15, 23, 42, 0.05)'
                      }}
                    >
                      {/* Top Header of Order */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px',
                        marginBottom: '14px'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: isGovt ? '#DCFCE7' : '#DBEAFE',
                              color: isGovt ? '#166534' : '#1D4ED8'
                            }}>
                              {isGovt ? '🏛️ Municipal Officer Order' : '👤 Citizen Direct Booking'}
                            </span>
                            <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>
                              #{order.id}
                            </span>
                          </div>

                          <h3 style={{ margin: '6px 0 2px', fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                            {order.serviceTitle}
                          </h3>

                          {order.complaintId && (
                            <div style={{ fontSize: '12px', color: '#1E40AF', marginTop: '2px' }}>
                              Linked Grievance: <strong>#{order.complaintId}</strong> - {order.complaintTitle}
                            </div>
                          )}
                        </div>

                        {/* Estimated Fare Box */}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Estimated Fare</div>
                          <div style={{ fontSize: '22px', fontWeight: 800, color: '#065F46', fontFamily: 'monospace' }}>
                            ₹{order.estimatedFare}
                          </div>
                        </div>
                      </div>

                      {/* Details Strip */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '10px',
                        background: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        marginBottom: '16px',
                        fontSize: '12px',
                        color: '#475569'
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#64748B', marginBottom: '2px' }}>Customer / Officer</div>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{order.customerName}</div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 600, color: '#64748B', marginBottom: '2px' }}>Location & Ward</div>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{order.ward}</div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 600, color: '#64748B', marginBottom: '2px' }}>Scheduled Time</div>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{order.scheduledTime}</div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 600, color: '#64748B', marginBottom: '2px' }}>Urgency</div>
                          <div style={{
                            fontWeight: 700,
                            color: order.urgency?.includes('CRITICAL') ? '#DC2626' : order.urgency === 'URGENT' ? '#D97706' : '#0F172A'
                          }}>
                            {order.urgency || 'NORMAL'}
                          </div>
                        </div>
                      </div>

                      {/* Accept / Reject Buttons */}
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => rejectWorkerOrder(order.id, 'Worker busy with other priority site')}
                          style={{
                            padding: '9px 18px',
                            borderRadius: '10px',
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            color: '#475569',
                            fontWeight: 600,
                            fontSize: '12.5px',
                            cursor: 'pointer'
                          }}
                        >
                          Decline Request
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            acceptWorkerOrder(order.id);
                            setActiveTab('active');
                          }}
                          style={{
                            padding: '9px 24px',
                            borderRadius: '10px',
                            border: 'none',
                            background: '#065F46',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(6, 78, 59, 0.25)'
                          }}
                        >
                          <Check style={{ width: '15px', height: '15px' }} />
                          <span>Accept & Take Job</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. ACTIVE WORK IN PROGRESS */}
        {activeTab === 'active' && (
          <div>
            {activeOrders.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '48px 24px',
                textAlign: 'center'
              }}>
                <Wrench style={{ width: '38px', height: '38px', color: '#94A3B8', margin: '0 auto 12px' }} />
                <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>
                  No Active Jobs Right Now
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                  Accept incoming requests above to begin field service.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {activeOrders.map(order => (
                  <div
                    key={order.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '20px',
                      padding: '20px',
                      boxShadow: '0 4px 18px -2px rgba(15, 23, 42, 0.05)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginBottom: '14px'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: order.status === 'IN_PROGRESS' ? '#FEF3C7' : '#DBEAFE',
                            color: order.status === 'IN_PROGRESS' ? '#B45309' : '#1D4ED8'
                          }}>
                            {order.status === 'IN_PROGRESS' ? '🔨 WORK IN PROGRESS' : 'ACCEPTED & EN ROUTE'}
                          </span>
                          <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>
                            #{order.id}
                          </span>
                        </div>

                        <h3 style={{ margin: '6px 0 2px', fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                          {order.serviceTitle}
                        </h3>

                        {order.complaintId && (
                          <div style={{ fontSize: '12px', color: '#1E40AF', marginTop: '2px' }}>
                            Grievance #{order.complaintId}: {order.complaintTitle}
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Fare Agreed</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#065F46', fontFamily: 'monospace' }}>
                          ₹{order.estimatedFare}
                        </div>
                      </div>
                    </div>

                    {/* Customer Info Strip */}
                    <div style={{
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                          Customer: {order.customerName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <MapPin style={{ width: '13px', height: '13px', color: '#065F46' }} />
                          {order.ward}
                        </div>
                      </div>

                      <a
                        href={`tel:${order.customerPhone}`}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          background: '#065F46',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Phone style={{ width: '13px', height: '13px' }} />
                        <span>Call Customer</span>
                      </a>
                    </div>

                    {/* Work Progress Stepper */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '20px',
                      fontSize: '11.5px',
                      fontWeight: 700
                    }}>
                      <div style={{ color: '#065F46', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                        <span>1. Accepted</span>
                      </div>
                      <div style={{ width: '20px', height: '2px', background: '#CBD5E1' }} />
                      <div style={{
                        color: order.status === 'IN_PROGRESS' ? '#065F46' : '#64748B',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <CheckCircle2 style={{ width: '14px', height: '14px', color: order.status === 'IN_PROGRESS' ? '#065F46' : '#94A3B8' }} />
                        <span>2. In Progress</span>
                      </div>
                      <div style={{ width: '20px', height: '2px', background: '#CBD5E1' }} />
                      <div style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #CBD5E1' }} />
                        <span>3. Work Completed</span>
                      </div>
                    </div>

                    {/* Completion Notes form when marking complete */}
                    {completingOrderId === order.id ? (
                      <div style={{
                        background: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '12px',
                        padding: '14px',
                        marginBottom: '16px'
                      }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '6px' }}>
                          Service Completion Notes & Evidence Summary *
                        </label>
                        <textarea
                          rows={2}
                          value={completionNotes}
                          onChange={e => setCompletionNotes(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: '1px solid #86EFAC',
                            fontSize: '12.5px',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                          <button
                            type="button"
                            onClick={() => setCompletingOrderId(null)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: '#FFFFFF',
                              border: '1px solid #CBD5E1',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              completeWorkerOrder(order.id, { completionNotes });
                              setCompletingOrderId(null);
                              setActiveTab('completed');
                            }}
                            style={{
                              padding: '6px 16px',
                              borderRadius: '8px',
                              background: '#16A34A',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Confirm Work Complete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        {order.status === 'ACCEPTED' && (
                          <button
                            type="button"
                            onClick={() => startWorkerOrder(order.id)}
                            style={{
                              padding: '9px 18px',
                              borderRadius: '10px',
                              border: '1px solid #065F46',
                              background: '#ECFDF5',
                              color: '#065F46',
                              fontWeight: 700,
                              fontSize: '12.5px',
                              cursor: 'pointer'
                            }}
                          >
                            Mark Arrived On Site
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setCompletingOrderId(order.id)}
                          style={{
                            padding: '9px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            background: '#065F46',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(6, 78, 59, 0.25)'
                          }}
                        >
                          <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                          <span>Mark Work Completed</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. COMPLETED JOBS & PAYMENT SETTLEMENT */}
        {activeTab === 'completed' && (
          <div>
            {completedOrders.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '48px 24px',
                textAlign: 'center'
              }}>
                <CheckCircle2 style={{ width: '38px', height: '38px', color: '#94A3B8', margin: '0 auto 12px' }} />
                <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>
                  No Completed Orders Yet
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                  Once you finish jobs, payment receipts and citizen reviews will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '14px' }}>
                {completedOrders.map(order => {
                  const isPaid = order.status === 'PAID' || order.status === 'CLOSED';
                  return (
                    <div
                      key={order.id}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '18px',
                        padding: '18px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>
                            #{order.id}
                          </span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background: isPaid ? '#DCFCE7' : '#FEF3C7',
                            color: isPaid ? '#166534' : '#B45309'
                          }}>
                            {isPaid ? 'PAID & SETTLED' : 'PAYMENT PENDING'}
                          </span>
                        </div>

                        <h4 style={{ margin: '4px 0 2px', fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                          {order.serviceTitle}
                        </h4>

                        <div style={{ fontSize: '12px', color: '#64748B' }}>
                          {order.customerName} · {order.ward} · Completed on {new Date(order.completedAt || Date.now()).toLocaleDateString()}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>Earned Fare</div>
                          <div style={{ fontSize: '18px', fontWeight: 800, color: '#065F46', fontFamily: 'monospace' }}>
                            ₹{order.estimatedFare}
                          </div>
                        </div>

                        {!isPaid && (
                          <button
                            type="button"
                            onClick={() => settleWorkerPayment(order.id)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: '#16A34A',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Receive Payment
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
