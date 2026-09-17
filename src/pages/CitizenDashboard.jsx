import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, MapPin, ThumbsUp, ArrowRight,
  Sparkles, Bell, FileText, X, Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
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

const STATUS_STEPS = [
  { key:'SUBMITTED',          label:'Submitted',   icon:'📋', desc:'Your complaint is received & logged' },
  { key:'ASSIGNED',           label:'Assigned',    icon:'👮', desc:'Officer assigned to your case' },
  { key:'IN_PROGRESS',        label:'In Progress', icon:'🔧', desc:'Field crew is working on it' },
  { key:'RESOLVED',           label:'Resolved',    icon:'✅', desc:'Work completed by the team' },
  { key:'RESOLVED_CONFIRMED', label:'Verified',    icon:'🎉', desc:'You confirmed the fix on ground' },
];

function getStepIndex(status) {
  const s = (status||'').toUpperCase();
  if (s==='RESOLVED_CONFIRMED') return 4;
  if (s==='RESOLVED')           return 3;
  if (s==='IN_PROGRESS')        return 2;
  if (s==='ASSIGNED')           return 1;
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
  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(15,23,42,0.45)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:'100%',maxWidth:'560px',maxHeight:'90vh',overflowY:'auto',borderRadius:'24px',background:'#FFFFFF',border:'1px solid #E2E8F0',boxShadow:'0 25px 50px -12px rgba(15,23,42,0.25)'}}>
        <div style={{background:catCfg.light,borderBottom:`1px solid ${catCfg.border}`,borderRadius:'24px 24px 0 0',padding:'24px',position:'relative'}}>
          <button onClick={onClose} style={{position:'absolute',top:'18px',right:'18px',background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:'50%',width:'32px',height:'32px',cursor:'pointer',color:'#64748B',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}><X style={{width:'15px',height:'15px'}}/></button>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'14px',background:'#FFFFFF',border:`1px solid ${catCfg.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',boxShadow:'0 2px 6px rgba(0,0,0,0.04)'}}>
              {catCfg.emoji}
            </div>
            <div>
              <span style={{fontSize:'10.5px',fontWeight:700,letterSpacing:'0.5px',color:catCfg.text,background:catCfg.badgeBg,padding:'2px 8px',borderRadius:'999px',textTransform:'uppercase'}}>
                {catCfg.label}
              </span>
              <div style={{fontSize:'12px',color:'#64748B',fontFamily:'monospace',marginTop:'2px'}}>
                ID: {item.id}
              </div>
            </div>
          </div>
          <h2 style={{color:'#0F172A',fontSize:'18px',fontWeight:800,margin:'0 0 10px',lineHeight:1.3}}>{item.title}</h2>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <span style={{background:'#FFFFFF',color:'#475569',border:'1px solid #E2E8F0',borderRadius:'999px',padding:'3px 10px',fontSize:'11.5px',fontWeight:600}}>📍 {item.location?.area||item.location?.ward||'Ward Area'}</span>
            {item.urgency==='CRITICAL'?(
              <span style={{background:'#FEF2F2',color:'#DC2626',border:'1px solid #FECACA',borderRadius:'999px',padding:'3px 10px',fontSize:'11.5px',fontWeight:700}}>● Critical Priority</span>
            ):(
              <span style={{background:'#F8FAFC',color:'#475569',border:'1px solid #E2E8F0',borderRadius:'999px',padding:'3px 10px',fontSize:'11.5px',fontWeight:600}}>● {item.urgency||'NORMAL'}</span>
            )}
          </div>
        </div>
        <div style={{padding:'24px'}}>
          <div style={{fontSize:'12px',fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'18px'}}>📦 Resolution Timeline</div>
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
          <div style={{margin:'0 24px 16px',padding:'14px 16px',background:'#F8FAFC',borderRadius:'14px',border:'1px solid #E2E8F0'}}>
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
          <button onClick={()=>upvoteGrievance(item.id)} style={{flex:1,height:'44px',borderRadius:'12px',border:'1px solid #E2E8F0',background:'#F8FAFC',cursor:'pointer',fontSize:'13px',fontWeight:700,color:'#334155',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
            <ThumbsUp style={{width:'14px',height:'14px'}}/> Upvote ({item.upvotes||1})
          </button>
          <Link to={`/citizen/complaints/${item.id}`} style={{flex:2,height:'44px',borderRadius:'12px',background:'#2563EB',color:'#FFFFFF',fontWeight:700,fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',textDecoration:'none',boxShadow:'0 2px 6px rgba(37,99,235,0.2)'}}>
            {item.status==='RESOLVED'?'Verify Resolution':'Full Investigation View'} <ArrowRight style={{width:'15px',height:'15px'}}/>
          </Link>
        </div>
      </div>
    </div>
  );
}

function GrievanceCard({item,citizen,onOpen}) {
  const catCfg = getCatConfig(item);
  const stepIdx = getStepIndex(item.status);
  const isMine = item.citizenId===citizen?.id||(item.citizenName&&citizen?.name&&item.citizenName.toLowerCase()===citizen.name.toLowerCase());
  return (
    <div onClick={()=>onOpen(item)} style={{borderRadius:'18px',overflow:'hidden',cursor:'pointer',border:'1px solid #E2E8F0',background:'#FFFFFF',boxShadow:'0 1px 3px rgba(0,0,0,0.03)',transition:'transform 0.15s ease,box-shadow 0.15s ease'}}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 10px 20px -5px rgba(15,23,42,0.08)';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.03)';}}>
      <div style={{background:catCfg.light,borderBottom:`1px solid ${catCfg.border}`,padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <span style={{fontSize:'18px'}}>{catCfg.emoji}</span>
          <div>
            <span style={{fontSize:'10.5px',fontWeight:700,color:catCfg.text,textTransform:'uppercase'}}>{catCfg.label}</span>
            <span style={{marginLeft:'6px',color:'#64748B',fontSize:'11px',fontFamily:'monospace'}}>#{item.id?.slice(-7)||'N/A'}</span>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
          {isMine&&<span style={{background:'#DBEAFE',color:'#1E40AF',borderRadius:'999px',padding:'2px 8px',fontSize:'10px',fontWeight:700}}>Mine</span>}
          {item.urgency==='CRITICAL'&&<span style={{background:'#FEE2E2',color:'#DC2626',borderRadius:'999px',padding:'2px 8px',fontSize:'10px',fontWeight:700}}>Critical</span>}
        </div>
      </div>
      <div style={{padding:'16px'}}>
        <h3 style={{fontSize:'14.5px',fontWeight:700,color:'#0F172A',marginBottom:'6px',lineHeight:1.35}}>{item.title}</h3>
        <p style={{fontSize:'12.5px',color:'#64748B',lineHeight:1.45,marginBottom:'14px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{item.descriptionRaw||item.description||'No description provided.'}</p>
        <div style={{marginBottom:'12px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
            <span style={{fontSize:'11px',fontWeight:700,color:'#1D4ED8'}}>{STATUS_STEPS[stepIdx]?.icon} {STATUS_STEPS[stepIdx]?.label}</span>
            <span style={{fontSize:'11px',color:'#94A3B8'}}>Step {stepIdx+1} of {STATUS_STEPS.length}</span>
          </div>
          <div style={{height:'5px',background:'#F1F5F9',borderRadius:'999px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${(stepIdx/(STATUS_STEPS.length-1))*100}%`,background:'#2563EB',borderRadius:'999px',transition:'width 0.3s ease'}}/>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'11.5px',color:'#64748B'}}>
          <span style={{display:'flex',alignItems:'center',gap:'4px'}}><MapPin style={{width:'12px',height:'12px',color:'#94A3B8'}}/>{item.location?.area||item.location?.ward||'Ward Area'}</span>
          <span style={{display:'flex',alignItems:'center',gap:'3px'}}><ThumbsUp style={{width:'12px',height:'12px',color:'#94A3B8'}}/>{item.upvotes||1}</span>
          <span style={{color:'#2563EB',fontWeight:700,fontSize:'11px'}}>Track Order →</span>
        </div>
      </div>
    </div>
  );
}

export default function CitizenDashboard() {
  const {grievances=[],upvoteGrievance,user,token,currentCitizen:contextCitizen,civicIncidents=[],notifications:contextNotifs=[]} = useApp();
  const [activeTab,setActiveTab]             = useState('all');
  const [searchQuery,setSearchQuery]         = useState('');
  const [showSignalModal,setShowSignalModal] = useState(false);
  const [showFileModal,setShowFileModal]     = useState(false);
  const [fileModalCategory,setFileModalCategory] = useState('');
  const [selectedGrievance,setSelectedGrievance] = useState(null);
  const [dashboardData,setDashboardData]     = useState(null);
  const citizen = user||contextCitizen||{id:'USR-CITIZEN-01',name:'Aditya Verma',ward:'Ward 14 (Rohini Sector 14)',pincode:'110085'};

  useEffect(()=>{
    let m=true;
    (async()=>{
      try{const h=token?{Authorization:`Bearer ${token}`}:{};const r=await fetch('/api/citizen/dashboard',{headers:h});if(r.ok){const d=await r.json();if(m&&d.success)setDashboardData(d);}}catch(_){}
    })();
    return ()=>{m=false;};
  },[token,grievances.length]);

  const myReports           = dashboardData?.myReports||grievances.filter(g=>g.citizenId===citizen.id||(g.citizenName&&citizen.name&&g.citizenName.toLowerCase()===citizen.name.toLowerCase()));
  const pendingVerification = myReports.filter(g=>g.status==='RESOLVED');
  const citizenNotifications= dashboardData?.notifications||contextNotifs.filter(n=>n.userRole==='citizen'||n.userId===citizen.id);
  const activeWardIncident  = civicIncidents[0];
  const currentHour=new Date().getHours();
  const greeting=currentHour<12?'Good morning':currentHour<17?'Good afternoon':'Good evening';

  const filteredGrievances=grievances.filter(g=>{
    const q=searchQuery.toLowerCase();
    const ok=!q||(g.title||'').toLowerCase().includes(q)||(g.descriptionRaw||'').toLowerCase().includes(q)||(g.id||'').toLowerCase().includes(q);
    if(!ok)return false;
    if(activeTab==='my')return g.citizenId===citizen.id||(g.citizenName&&citizen.name&&g.citizenName.toLowerCase()===citizen.name.toLowerCase());
    if(activeTab==='verification')return g.status==='RESOLVED'&&(g.citizenId===citizen.id||(g.citizenName&&citizen.name&&g.citizenName.toLowerCase()===citizen.name.toLowerCase()));
    if(activeTab==='active')return g.status!=='RESOLVED'&&g.status!=='RESOLVED_CONFIRMED';
    if(activeTab==='resolved')return g.status==='RESOLVED'||g.status==='RESOLVED_CONFIRMED';
    return true;
  });

  const catCounts={};
  grievances.forEach(g=>{const c=getCatConfig(g);catCounts[c.key]=(catCounts[c.key]||0)+1;});

  const TABS = [
    { key:'all',           label:`All (${grievances.length})` },
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
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'14px'}}>
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
