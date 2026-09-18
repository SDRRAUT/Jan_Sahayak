import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus, Search, MapPin, ThumbsUp, ArrowRight,
  Sparkles, Bell, FileText, X, Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_GRIEVANCES } from '../data/mockGrievances';
import { normalizeStatus, getRoleStatusLabel, getStatusConfig } from '../utils/statuses';
import WhyExplainer from '../components/common/WhyExplainer';
import CivicSignalModal from '../components/intelligence/CivicSignalModal';
import FileGrievanceModal from '../components/common/FileGrievanceModal';

const PROBLEM_CATEGORIES = [
  { key:'Water Supply & Contamination', label:'Water Supply',    emoji:'💧', light:'#F0F9FF', border:'#BAE6FD', text:'#0369A1', badgeBg:'#E0F2FE' },
  { key:'Roads & Infrastructure',       label:'Roads & Potholes', emoji:'🚧', light:'#FFFBEB', border:'#FDE68A', text:'#B45309', badgeBg:'#FEF3C7' },
  { key:'Sanitation & Solid Waste',     label:'Garbage & Waste', emoji:'🗑️', light:'#ECFDF5', border:'#A7F3D0', text:'#047857', badgeBg:'#D1FAE5' },
  { key:'Electricity & Power Grid',     label:'Light & Power',   emoji:'💡', light:'#F5F3FF', border:'#DDD6FE', text:'#6D28D9', badgeBg:'#EDE9FE' },
  { key:'Drainage & Waterlogging',      label:'Drainage & Sewer', emoji:'🌊', light:'#F0FDFA', border:'#99F6E4', text:'#0F766E', badgeBg:'#CCFBF1' },
  { key:'Other Civic Issue',            label:'Civic Issue',     emoji:'📢', light:'#FDF2F8', border:'#FBCFE8', text:'#BE185D', badgeBg:'#FCE7F3' },
];

const CATEGORY_IMAGES = {
  'Water Supply & Contamination': '/civic-problems/water_pipe_leak.jpg',
  'Roads & Infrastructure': '/civic-problems/pothole_broken_drain_grate.jpg',
  'Sanitation & Solid Waste': '/civic-problems/roadside_garbage_heap.jpg',
  'Electricity & Power Grid': '/civic-problems/monsoon_waterlogging_flood.jpg',
  'Drainage & Waterlogging': '/civic-problems/open_sewage_nullah_garbage.jpg',
  'Other Civic Issue': '/civic-problems/construction_dust_pollution.jpg'
};

const STATUS_STEPS = [
  { key:'REPORTED',           label:'Submitted',       icon:'📋', desc:'Your complaint is logged in system' },
  { key:'ANALYZING',          label:'AI Analyzing',    icon:'✨', desc:'AI extracts DNA & correlates signals' },
  { key:'AUTHORITY_ASSIGNED', label:'Assigned',        icon:'👮', desc:'Assigned to field division' },
  { key:'INVESTIGATION',      label:'Investigation',   icon:'🔍', desc:'Field inspection started' },
  { key:'ACTION_IN_PROGRESS', label:'Work In Progress',icon:'🔧', desc:'Remediation crew active on site' },
  { key:'ACTION_COMPLETED',   label:'Action Completed',icon:'📸', desc:'Repairs completed with evidence' },
  { key:'RESOLVED',           label:'Verified & Closed',icon:'🎉', desc:'Problem fixed & closed' },
];

function getStepIndex(status) {
  const s = normalizeStatus(status);
  if (s === 'RESOLVED') return 6;
  if (s === 'VERIFICATION_PENDING' || s === 'ACTION_COMPLETED') return 5;
  if (s === 'ACTION_IN_PROGRESS') return 4;
  if (s === 'INVESTIGATION') return 3;
  if (s === 'AUTHORITY_ASSIGNED' || s === 'INCIDENT_CREATED') return 2;
  if (s === 'CONNECTED' || s === 'ANALYZING') return 1;
  return 0;
}

function getCatConfig(g) {
  const cat = (g.category||g.department||'').toLowerCase();
  return PROBLEM_CATEGORIES.find(c => cat.includes(c.key.split(' ')[0].toLowerCase()) || c.key.toLowerCase().split(' ')[0].includes(cat.split(' ')[0])) || PROBLEM_CATEGORIES[5];
}

function GrievanceDetailPopup({ item, onClose, citizen, upvoteGrievance }) {
  if (!item) return null;
  const catCfg = getCatConfig(item);
  const stepIdx = getStepIndex(item.status);
  const displayImage = item.evidence?.photoUrl || item.photoPreview || item.photoUrl || CATEGORY_IMAGES[catCfg.key] || CATEGORY_IMAGES['Other Civic Issue'];

  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(15,23,42,0.5)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:'100%',maxWidth:'580px',maxHeight:'90vh',overflowY:'auto',borderRadius:'26px',background:'#FFFFFF',border:'1px solid #E2E8F0',boxShadow:'0 25px 50px -12px rgba(15,23,42,0.25)'}}>
        {/* Editorial Photo Header */}
        <div style={{position:'relative',height:'180px',width:'100%',overflow:'hidden',borderRadius:'26px 26px 0 0',background:'#F1F5F9'}}>
          <img src={displayImage} alt={item.title} style={{width:'100%',height:'100%',objectFit:'cover'}} />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%)',pointerEvents:'none'}} />
          
          <button onClick={onClose} style={{position:'absolute',top:'16px',right:'16px',background:'rgba(255,255,255,0.9)',border:'none',borderRadius:'50%',width:'34px',height:'34px',cursor:'pointer',color:'#0F172A',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.15)',zIndex:2}}>
            <X style={{width:'16px',height:'16px'}}/>
          </button>

          {/* Floating Pill Badge */}
          <div style={{position:'absolute',top:'16px',left:'16px',background:'rgba(255,255,255,0.95)',backdropFilter:'blur(8px)',borderRadius:'999px',padding:'4px 12px',display:'flex',alignItems:'center',gap:'6px',boxShadow:'0 2px 8px rgba(0,0,0,0.12)'}}>
            <span style={{fontSize:'13px'}}>{catCfg.emoji}</span>
            <span style={{fontSize:'11.5px',fontWeight:700,color:'#0F172A'}}>{catCfg.label}</span>
          </div>

          <div style={{position:'absolute',bottom:'14px',left:'18px',right:'18px',color:'#FFFFFF'}}>
            <div style={{fontSize:'11px',fontWeight:700,opacity:0.85,fontFamily:'monospace',marginBottom:'2px'}}>#{item.id}</div>
            <h2 style={{fontSize:'18px',fontWeight:800,margin:0,lineHeight:1.3,color:'#FFFFFF'}}>{item.title}</h2>
          </div>
        </div>

        {/* Status Timeline */}
        <div style={{padding:'22px 24px'}}>
          <div style={{fontSize:'12px',fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'18px'}}>
            📦 Resolution Timeline
          </div>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:'18px',top:'10px',width:'2px',height:'calc(100% - 32px)',background:'#E2E8F0'}}/>
            <div style={{position:'absolute',left:'18px',top:'10px',width:'2px',height:`${(stepIdx/(STATUS_STEPS.length-1))*100}%`,background:'#2563EB',transition:'height 0.4s ease'}}/>
            {STATUS_STEPS.map((step,idx)=>{
              const done=idx<=stepIdx, active=idx===stepIdx;
              return (
                <div key={step.key} style={{display:'flex',alignItems:'flex-start',gap:'14px',marginBottom:idx<STATUS_STEPS.length-1?'20px':'0',position:'relative'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'50%',flexShrink:0,background:active?'#2563EB':done?'#EFF6FF':'#F8FAFC',border:active?'3px solid #BFDBFE':done?'2px solid #2563EB':'2px solid #CBD5E1',color:active?'#FFFFFF':done?'#2563EB':'#94A3B8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',zIndex:1,transition:'all 0.2s'}}>
                    {done?(active?step.icon:'✓'):idx+1}
                  </div>
                  <div style={{paddingTop:'4px',flex:1}}>
                    <div style={{fontSize:'13px',fontWeight:active?800:done?700:500,color:active?'#1D4ED8':done?'#0F172A':'#94A3B8'}}>
                      {step.label}{active&&<span style={{marginLeft:'8px',fontSize:'10px',background:'#DBEAFE',color:'#1D4ED8',padding:'2px 8px',borderRadius:'999px',fontWeight:800}}>ACTIVE STAGE</span>}
                    </div>
                    <div style={{fontSize:'12px',color:done?'#64748B':'#94A3B8',marginTop:'2px'}}>{step.desc}</div>
                    {active&&item.updatedAt&&<div style={{fontSize:'11px',color:'#2563EB',marginTop:'3px',fontWeight:600}}>Updated: {item.updatedAt}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {(item.descriptionRaw||item.description)&&(
          <div style={{margin:'0 24px 16px',padding:'14px 16px',background:'#F8FAFC',borderRadius:'16px',border:'1px solid #E2E8F0'}}>
            <div style={{fontSize:'11px',fontWeight:800,color:'#64748B',textTransform:'uppercase',marginBottom:'6px'}}>Citizen Complaint Statement</div>
            <p style={{fontSize:'13px',color:'#334155',lineHeight:1.5,margin:0}}>"{(item.descriptionRaw||item.description||'').substring(0,300)}"</p>
          </div>
        )}

        <div style={{margin:'0 24px 20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          {[
            {label:'Department',   value:item.department||'Civic Services', col:'#1D4ED8', bg:'#EFF6FF'},
            {label:'SLA Target',   value:item.slaDeadline||'24–48 Hours',   col:'#B45309', bg:'#FFFBEB'},
            {label:'Ward Upvotes', value:`👍 ${item.upvotes||1} neighbours`,col:'#047857', bg:'#ECFDF5'},
            {label:'Priority Tier',value:item.urgency==='CRITICAL'?'Critical':item.urgency==='HIGH'?'High':'Normal', col:'#6D28D9', bg:'#F5F3FF'},
          ].map(info=>(
            <div key={info.label} style={{padding:'12px 14px',background:info.bg,borderRadius:'12px',border:'1px solid rgba(0,0,0,0.04)'}}>
              <div style={{fontSize:'10.5px',fontWeight:700,color:info.col,textTransform:'uppercase',marginBottom:'3px'}}>{info.label}</div>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0F172A'}}>{info.value}</div>
            </div>
          ))}
        </div>

        <div style={{padding:'0 24px 24px',display:'flex',gap:'10px'}}>
          <button onClick={()=>upvoteGrievance(item.id)} style={{flex:1,height:'44px',borderRadius:'999px',border:'1px solid #E2E8F0',background:'#F8FAFC',cursor:'pointer',fontSize:'13px',fontWeight:700,color:'#334155',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
            <ThumbsUp style={{width:'14px',height:'14px'}}/> Upvote ({item.upvotes||1})
          </button>
          <Link to={`/citizen/complaints/${item.id}`} style={{flex:2,height:'44px',borderRadius:'999px',background:'#0F172A',color:'#FFFFFF',fontWeight:700,fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',textDecoration:'none',boxShadow:'0 2px 8px rgba(15,23,42,0.15)'}}>
            {item.status==='RESOLVED'?'Verify Resolution':'Full Investigation View'} <ArrowRight style={{width:'15px',height:'15px'}}/>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Editorial Reference-Style Grievance Card ─────────────────────────────────
function GrievanceCard({ item, citizen, onOpen }) {
  const catCfg = getCatConfig(item);
  const stepIdx = getStepIndex(item.status);
  const isMine = item.citizenId === citizen?.id ||
    (item.citizenName && citizen?.name && item.citizenName.toLowerCase() === citizen.name.toLowerCase());

  const displayImage = item.evidence?.photoUrl || item.photoPreview || item.photoUrl || CATEGORY_IMAGES[catCfg.key] || CATEGORY_IMAGES['Other Civic Issue'];

  const deptShort = (item.department || 'Civic Services')
    .replace('Delhi Jal Board (DJB)', 'DJB')
    .replace('Public Works Department (PWD)', 'PWD')
    .replace('Municipal Corporation of Delhi (MCD)', 'MCD')
    .replace('BSES Rajdhani Power Limited', 'BSES')
    .slice(0, 16);

  return (
    <div
      onClick={() => onOpen(item)}
      style={{
        borderRadius: '24px',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 18px -2px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 20px 38px -8px rgba(15, 23, 42, 0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 4px 18px -2px rgba(15, 23, 42, 0.05)';
      }}
    >
      {/* ── Top Photo Header (Matching Reference 2 Card Visuals) ── */}
      <div style={{
        position: 'relative',
        height: '185px',
        width: '100%',
        overflow: 'hidden',
        background: '#F1F5F9'
      }}>
        <img
          src={displayImage}
          alt={item.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* Soft gradient wash */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Floating Top-Left Category Badge (Like "Prime Pick" in Reference 2) */}
        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: '999px',
          padding: '4px 12px',
          display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
        }}>
          <span style={{ fontSize: '13px' }}>{catCfg.emoji}</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>
            {catCfg.label}
          </span>
        </div>

        {/* Floating Top-Right Badges */}
        <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '6px' }}>
          {isMine && (
            <span style={{
              background: 'rgba(37, 99, 235, 0.95)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              borderRadius: '999px',
              padding: '4px 10px',
              fontSize: '10.5px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(37,99,235,0.3)'
            }}>
              👤 Mine
            </span>
          )}
          {item.urgency === 'CRITICAL' && (
            <span style={{
              background: 'rgba(220, 38, 38, 0.95)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              borderRadius: '999px',
              padding: '4px 10px',
              fontSize: '10.5px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(220,38,38,0.3)'
            }}>
              ● Critical
            </span>
          )}
        </div>

        {/* Bottom of Image Metadata Bar */}
        <div style={{
          position: 'absolute', bottom: '12px', left: '16px', right: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: '#FFFFFF', fontSize: '11px', fontWeight: 600,
          textShadow: '0 1px 3px rgba(0,0,0,0.7)'
        }}>
          <span style={{ fontFamily: 'monospace', opacity: 0.9 }}>
            #{item.id?.slice(-8) || 'N/A'}
          </span>
          <span style={{
            background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(6px)',
            padding: '2px 8px', borderRadius: '6px', fontSize: '10.5px'
          }}>
            ⏱️ SLA: {item.slaDeadline || '24h'}
          </span>
        </div>
      </div>

      {/* ── Card Body (Inspired by Reference 2 Layout) ── */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title */}
        <h3 style={{
          fontSize: '15.5px',
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.35,
          margin: '0 0 6px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '42px'
        }}>
          {item.title}
        </h3>

        {/* Snippet */}
        <p style={{
          fontSize: '12.5px',
          color: '#64748B',
          lineHeight: 1.45,
          margin: '0 0 14px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {item.descriptionRaw || item.description || 'Civic issue logged in ward. Field team monitoring resolution.'}
        </p>

        {/* Specs Row with Subtle Dividers (Directly from Reference 2) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderTop: '1px solid #F1F5F9',
          borderBottom: '1px solid #F1F5F9',
          marginBottom: '14px',
          fontSize: '11.5px',
          color: '#475569'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', maxWidth: '42%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <MapPin style={{ width: '12px', height: '12px', color: '#94A3B8', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.location?.area || item.location?.ward || 'Ward Area'}</span>
          </span>
          <span style={{ color: '#E2E8F0' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            🏛️ {deptShort}
          </span>
          <span style={{ color: '#E2E8F0' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <ThumbsUp style={{ width: '11px', height: '11px', color: '#2563EB' }} />
            {item.upvotes || 1}
          </span>
        </div>

        {/* Step Progress Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>{STATUS_STEPS[stepIdx]?.icon}</span>
              <span>{STATUS_STEPS[stepIdx]?.label}</span>
            </span>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
              Step {stepIdx + 1} of {STATUS_STEPS.length}
            </span>
          </div>
          <div style={{ height: '5px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${((stepIdx + 0.15) / (STATUS_STEPS.length - 1)) * 100}%`,
              background: '#2563EB',
              borderRadius: '999px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Dark Pill Action Button (Like "Start Cooking" / "View Details" in Reference 2) */}
        <div style={{ marginTop: 'auto' }}>
          <button
            type="button"
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '999px',
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
              transition: 'background 0.2s ease, transform 0.2s ease'
            }}
          >
            <span>View Details & Track</span>
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CitizenDashboard() {
  const {grievances=[],upvoteGrievance,user,token,currentCitizen:contextCitizen,civicIncidents=[],notifications:contextNotifs=[]} = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab,setActiveTab]             = useState('all');
  const [searchQuery,setSearchQuery]         = useState('');
  const [showSignalModal,setShowSignalModal] = useState(false);
  const [showFileModal,setShowFileModal]     = useState(false);
  const [fileModalCategory,setFileModalCategory] = useState('');
  const [selectedGrievance,setSelectedGrievance] = useState(null);
  const [dashboardData,setDashboardData]     = useState(null);
  const citizen = user||contextCitizen||{id:'USR-CITIZEN-01',name:'Aditya Verma',ward:'Ward 14 (Rohini Sector 14)',pincode:'110085'};

  // If navigated with ?fileGrievance=true, automatically open the popup modal
  useEffect(() => {
    if (searchParams.get('fileGrievance') === 'true') {
      setShowFileModal(true);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('fileGrievance');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(()=>{
    let m=true;
    (async()=>{
      try{const h=token?{Authorization:`Bearer ${token}`}:{};const r=await fetch('/api/citizen/dashboard',{headers:h});if(r.ok){const d=await r.json();if(m&&d.success)setDashboardData(d);}}catch(_){}
    })();
    return ()=>{m=false;};
  },[token,grievances.length]);

  const displayGrievances   = (grievances && grievances.length > 0) ? grievances : INITIAL_GRIEVANCES;
  const myReports           = dashboardData?.myReports || displayGrievances.filter(g => 
    g.citizenId === citizen.id || 
    (g.citizenName && citizen.name && g.citizenName.toLowerCase() === citizen.name.toLowerCase()) ||
    (citizen.name && g.citizenName && g.citizenName.includes('Aditya'))
  );
  const pendingVerification = myReports.filter(g => g.status === 'RESOLVED');
  const citizenNotifications= dashboardData?.notifications || contextNotifs.filter(n => n.userRole === 'citizen' || n.userId === citizen.id);
  const activeWardIncident  = civicIncidents[0];
  const currentHour=new Date().getHours();
  const greeting=currentHour<12?'Good morning':currentHour<17?'Good afternoon':'Good evening';

  const filteredGrievances=displayGrievances.filter(g=>{
    const q=searchQuery.toLowerCase();
    const ok=!q||(g.title||'').toLowerCase().includes(q)||(g.descriptionRaw||'').toLowerCase().includes(q)||(g.id||'').toLowerCase().includes(q);
    if(!ok)return false;
    if(activeTab==='my')return g.citizenId===citizen.id||(g.citizenName&&citizen.name&&g.citizenName.toLowerCase()===citizen.name.toLowerCase())||(citizen.name&&g.citizenName&&g.citizenName.includes('Aditya'));
    if(activeTab==='verification')return g.status==='RESOLVED'&&(g.citizenId===citizen.id||(g.citizenName&&citizen.name&&g.citizenName.toLowerCase()===citizen.name.toLowerCase()));
    if(activeTab==='active')return g.status!=='RESOLVED'&&g.status!=='RESOLVED_CONFIRMED';
    if(activeTab==='resolved')return g.status==='RESOLVED'||g.status==='RESOLVED_CONFIRMED';
    return true;
  });

  const catCounts={};
  displayGrievances.forEach(g=>{const c=getCatConfig(g);catCounts[c.key]=(catCounts[c.key]||0)+1;});

  const TABS = [
    { key:'all',           label:`All (${displayGrievances.length})` },
    { key:'my',            label:`My Reports (${myReports.length})` },
    { key:'verification',  label:`Verify Fix (${pendingVerification.length})` },
    { key:'active',        label:'In Progress' },
    { key:'resolved',      label:'Resolved' },
    { key:'notifications', label:`Alerts (${citizenNotifications.length})` },
  ];

  return (
    <div style={{ minHeight:'calc(100vh - 72px)', background:'#F8FAFC', paddingBottom:'60px' }}>

      {/* ── Aesthetic Hero Box (Contained, curved corners, gap both sides) ── */}
      <div className="container" style={{ paddingTop:'24px' }}>
        <div style={{
          borderRadius:'24px',
          background:'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #EEF2FF 100%)',
          border:'1px solid #E2E8F0',
          boxShadow:'0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          padding:'32px',
          position:'relative',
          overflow:'hidden'
        }}>
          {/* Subtle background ambient ring */}
          <div style={{
            position:'absolute', top:'-60px', right:'-60px',
            width:'220px', height:'220px', borderRadius:'50%',
            background:'rgba(59, 130, 246, 0.05)', pointerEvents:'none'
          }} />

          {/* Top greeting and action buttons */}
          <div style={{
            display:'flex', alignItems:'flex-start', justifyContent:'space-between',
            flexWrap:'wrap', gap:'18px', marginBottom:'26px', position:'relative', zIndex:1
          }}>
            <div>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:'6px',
                background:'#EEF2FF', border:'1px solid #C7D2FE',
                borderRadius:'999px', padding:'3px 12px', marginBottom:'10px'
              }}>
                <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#2563EB' }} />
                <span style={{ fontSize:'11px', fontWeight:700, color:'#3730A3', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                  Citizen Access Portal
                </span>
              </div>
              <h1 style={{ fontSize:'28px', fontWeight:800, color:'#0F172A', margin:'0 0 6px', lineHeight:1.25 }}>
                {greeting}, {citizen.name?.split(' ')[0] || 'Citizen'} 👋
              </h1>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'#475569', fontSize:'13px' }}>
                <MapPin style={{ width:'14px', height:'14px', color:'#2563EB' }} />
                <span>{citizen.ward || 'Ward 14'} · PIN {citizen.pincode || '110085'}</span>
              </div>
            </div>

            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              <button
                onClick={() => { setFileModalCategory(''); setShowFileModal(true); }}
                style={{
                  height:'42px', padding:'0 18px', borderRadius:'12px',
                  background:'#2563EB', color:'#FFFFFF', border:'none',
                  fontWeight:700, fontSize:'13px', cursor:'pointer',
                  display:'flex', alignItems:'center', gap:'8px',
                  boxShadow:'0 2px 8px rgba(37,99,235,0.25)',
                  transition:'all 0.15s ease'
                }}
              >
                <Plus style={{ width:'16px', height:'16px' }} />
                File Grievance
              </button>
              <button
                onClick={() => setShowSignalModal(true)}
                style={{
                  height:'42px', padding:'0 16px', borderRadius:'12px',
                  background:'#FFFFFF', color:'#334155', border:'1px solid #CBD5E1',
                  fontWeight:600, fontSize:'13px', cursor:'pointer',
                  display:'flex', alignItems:'center', gap:'8px',
                  boxShadow:'0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <Radio style={{ width:'14px', height:'14px', color:'#2563EB' }} />
                Civic Signal
              </button>
            </div>
          </div>

          {/* Light aesthetic KPI Stat Cards */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',
            gap:'12px', position:'relative', zIndex:1
          }}>
            {[
              { label:'My Reports',        value:myReports.length,                                                                             col:'#2563EB', tab:'my' },
              { label:'Need Verification', value:pendingVerification.length,                                                                   col:'#D97706', tab:'verification' },
              { label:'In Progress',       value:grievances.filter(g => g.status !== 'RESOLVED' && g.status !== 'RESOLVED_CONFIRMED').length, col:'#059669', tab:'active' },
              { label:'Resolved Cases',    value:grievances.filter(g => g.status === 'RESOLVED' || g.status === 'RESOLVED_CONFIRMED').length, col:'#7C3AED', tab:'resolved' },
            ].map(s => {
              const isSelected = activeTab === s.tab;
              return (
                <div
                  key={s.tab}
                  onClick={() => setActiveTab(s.tab)}
                  style={{
                    background:'#FFFFFF',
                    border: isSelected ? `2px solid ${s.col}` : '1px solid #E2E8F0',
                    borderRadius:'16px',
                    padding:'16px 20px',
                    cursor:'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.02)',
                    transition:'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize:'11.5px', color:'#64748B', fontWeight:600, marginBottom:'6px' }}>
                    {s.label}
                  </div>
                  <div style={{
                    fontSize:'28px', fontWeight:800, color:s.col,
                    lineHeight:1, fontFamily:'monospace'
                  }}>
                    {s.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop:'24px' }}>

        {pendingVerification.length > 0 && (
          <div style={{
            background:'#FFFBEB', border:'1px solid #FCD34D', borderRadius:'16px',
            padding:'16px 20px', marginBottom:'20px',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:'12px'
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{
                width:'36px', height:'36px', borderRadius:'50%', background:'#FEF3C7',
                color:'#B45309', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700
              }}>
                ⚠️
              </div>
              <div>
                <strong style={{ fontSize:'13.5px', color:'#92400E', display:'block' }}>
                  Action Needed: {pendingVerification.length} report{pendingVerification.length > 1 ? 's' : ''} marked resolved
                </strong>
                <span style={{ fontSize:'12px', color:'#78350F' }}>
                  Field crew reported work done. Please confirm ground status to complete the loop.
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('verification')}
              style={{
                padding:'8px 16px', borderRadius:'10px', background:'#D97706',
                color:'#FFFFFF', border:'none', fontWeight:700, fontSize:'12.5px', cursor:'pointer'
              }}
            >
              Verify Fix →
            </button>
          </div>
        )}

        {activeWardIncident && (
          <div style={{
            background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'16px',
            padding:'14px 18px', marginBottom:'24px',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:'12px'
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <Sparkles style={{ width:'18px', height:'18px', color:'#059669', flexShrink:0 }} />
              <div>
                <strong style={{ fontSize:'13px', color:'#065F46', display:'block' }}>
                  Ward Intelligence: Active Coordinated Investigation
                </strong>
                <span style={{ fontSize:'12px', color:'#047857' }}>
                  {activeWardIncident.title} · Authorities responding
                </span>
              </div>
            </div>
            <span style={{
              background:'#DCFCE7', color:'#166534', borderRadius:'999px',
              padding:'4px 12px', fontSize:'11px', fontWeight:700
            }}>
              ✓ Response Active
            </span>
          </div>
        )}

        {/* Complaints */}
        <div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'18px',flexWrap:'wrap',gap:'12px'}}>
            <div style={{display:'flex',gap:'6px',overflowX:'auto',paddingBottom:'2px',flexWrap:'wrap'}}>
              {TABS.map(tab=>{
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={()=>setActiveTab(tab.key)}
                    style={{
                      padding:'7px 14px', borderRadius:'999px',
                      fontSize:'12.5px', fontWeight: isActive ? 700 : 500,
                      border: isActive ? '1px solid #2563EB' : '1px solid #E2E8F0',
                      background: isActive ? '#2563EB' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#475569',
                      cursor:'pointer', whiteSpace:'nowrap',
                      boxShadow: isActive ? '0 2px 6px rgba(37,99,235,0.2)' : 'none',
                      transition:'all 0.15s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            {activeTab!=='notifications'&&(
              <div style={{position:'relative',minWidth:'220px'}}>
                <Search style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',width:'14px',height:'14px',color:'#94A3B8'}}/>
                <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search complaints..." style={{height:'38px',width:'100%',borderRadius:'999px',border:'1px solid #E2E8F0',paddingLeft:'34px',paddingRight:'14px',fontSize:'12.5px',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}/>
              </div>
            )}
          </div>

          {activeTab==='notifications'?(
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {citizenNotifications.length===0?(
                <div style={{textAlign:'center',padding:'48px',background:'#fff',borderRadius:'16px',border:'1px solid #E2E8F0'}}><Bell style={{width:'36px',height:'36px',color:'#CBD5E1',margin:'0 auto 12px'}}/><p style={{color:'#94A3B8',fontSize:'14px'}}>No notifications yet</p></div>
              ):citizenNotifications.map(notif=>(
                <div key={notif.id} style={{background:'#fff',borderRadius:'12px',padding:'14px 18px',border:'1px solid #E2E8F0',borderLeft:`4px solid ${notif.type==='STATUS_UPDATE'?'#10B981':notif.type==='DISPUTE'?'#EF4444':'#2563EB'}`,boxShadow:'0 1px 4px rgba(0,0,0,0.03)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px'}}>
                    <div><strong style={{fontSize:'13px',color:'#0F172A'}}>{notif.title}</strong><p style={{fontSize:'12px',color:'#64748B',marginTop:'3px',lineHeight:1.4}}>{notif.message}</p></div>
                    {notif.grievanceId&&<Link to={`/citizen/complaints/${notif.grievanceId}`} style={{fontSize:'12px',color:'#2563EB',fontWeight:700,whiteSpace:'nowrap',textDecoration:'none'}}>View →</Link>}
                  </div>
                </div>
              ))}
            </div>
          ):filteredGrievances.length===0?(
            <div style={{textAlign:'center',padding:'60px',background:'#fff',borderRadius:'20px',border:'1px solid #E2E8F0'}}>
              <FileText style={{width:'40px',height:'40px',color:'#CBD5E1',margin:'0 auto 14px'}}/>
              <p style={{color:'#64748B',fontSize:'15px',marginBottom:'16px'}}>No complaints found here.</p>
              <button onClick={()=>setShowFileModal(true)} style={{padding:'10px 22px',background:'#2563EB',color:'#fff',borderRadius:'12px',border:'none',fontWeight:700,fontSize:'13.5px',cursor:'pointer',boxShadow:'0 2px 8px rgba(37,99,235,0.25)'}}>+ File Your First Complaint</button>
            </div>
          ):(
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(330px,1fr))',gap:'24px'}}>
              {filteredGrievances.map(item=>(
                <GrievanceCard key={item.id} item={item} citizen={citizen} onOpen={setSelectedGrievance}/>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes livepulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.3)}}`}</style>

      {selectedGrievance&&<GrievanceDetailPopup item={selectedGrievance} onClose={()=>setSelectedGrievance(null)} citizen={citizen} upvoteGrievance={upvoteGrievance}/>}
      {showSignalModal&&<CivicSignalModal isOpen={showSignalModal} onClose={()=>setShowSignalModal(false)}/>}
      <FileGrievanceModal isOpen={showFileModal} onClose={()=>setShowFileModal(false)} defaultCategory={fileModalCategory}/>
    </div>
  );
}
