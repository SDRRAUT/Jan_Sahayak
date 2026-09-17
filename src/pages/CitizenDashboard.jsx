import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, MapPin, ThumbsUp, ArrowRight,
  Sparkles, Bell, FileText, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import WhyExplainer from '../components/common/WhyExplainer';
import CivicSignalModal from '../components/intelligence/CivicSignalModal';
import FileGrievanceModal from '../components/common/FileGrievanceModal';

const PROBLEM_CATEGORIES = [
  { key:'Water Supply & Contamination', label:'Water Problem',   sublabel:'Dirty / No water supply',   emoji:'💧', gradient:'linear-gradient(135deg,#0EA5E9,#0284C7)', light:'#E0F2FE', color:'#0284C7' },
  { key:'Roads & Infrastructure',       label:'Roads & Potholes', sublabel:'Bad roads, broken paths',    emoji:'🚧', gradient:'linear-gradient(135deg,#F59E0B,#D97706)', light:'#FEF3C7', color:'#D97706' },
  { key:'Sanitation & Solid Waste',     label:'Garbage Issue',   sublabel:'Uncollected waste, smell',   emoji:'🗑️', gradient:'linear-gradient(135deg,#10B981,#059669)', light:'#D1FAE5', color:'#059669' },
  { key:'Electricity & Power Grid',     label:'Light / Power',   sublabel:'No electricity, dark lanes', emoji:'💡', gradient:'linear-gradient(135deg,#8B5CF6,#7C3AED)', light:'#EDE9FE', color:'#7C3AED' },
  { key:'Drainage & Waterlogging',      label:'Drainage / Sewage', sublabel:'Blocked drains, flooding', emoji:'🌊', gradient:'linear-gradient(135deg,#06B6D4,#0891B2)', light:'#CFFAFE', color:'#0891B2' },
  { key:'Other Civic Issue',            label:'Other Problem',   sublabel:'Any civic complaint',        emoji:'📢', gradient:'linear-gradient(135deg,#EC4899,#DB2777)', light:'#FCE7F3', color:'#DB2777' },
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
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(15,23,42,0.65)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:'100%',maxWidth:'560px',maxHeight:'90vh',overflowY:'auto',borderRadius:'20px',background:'#fff',boxShadow:'0 32px 64px rgba(0,0,0,0.25)'}}>
        <div style={{background:catCfg.gradient,borderRadius:'20px 20px 0 0',padding:'24px 24px 20px',position:'relative'}}>
          <button onClick={onClose} style={{position:'absolute',top:'16px',right:'16px',background:'rgba(255,255,255,0.2)',border:'none',borderRadius:'50%',width:'32px',height:'32px',cursor:'pointer',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><X style={{width:'16px',height:'16px'}}/></button>
          <div style={{fontSize:'40px',marginBottom:'8px'}}>{catCfg.emoji}</div>
          <div style={{fontSize:'11px',fontWeight:800,color:'rgba(255,255,255,0.7)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>{item.id}</div>
          <h2 style={{color:'#fff',fontSize:'18px',fontWeight:900,margin:'0 0 10px',lineHeight:1.3}}>{item.title}</h2>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <span style={{background:'rgba(255,255,255,0.2)',color:'#fff',borderRadius:'999px',padding:'3px 10px',fontSize:'11px',fontWeight:700}}>{catCfg.label}</span>
            <span style={{background:'rgba(255,255,255,0.2)',color:'#fff',borderRadius:'999px',padding:'3px 10px',fontSize:'11px',fontWeight:700}}>📍 {item.location?.area||item.location?.ward||'Ward Area'}</span>
            {item.urgency==='CRITICAL'&&<span style={{background:'#FEF2F2',color:'#DC2626',borderRadius:'999px',padding:'3px 10px',fontSize:'11px',fontWeight:800}}>🔴 CRITICAL</span>}
          </div>
        </div>
        <div style={{padding:'22px 24px 4px'}}>
          <div style={{fontSize:'12px',fontWeight:800,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'18px'}}>📦 Complaint Progress — Like Your Order Tracking</div>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:'18px',top:'10px',width:'2px',height:'calc(100% - 32px)',background:'#E2E8F0'}}/>
            <div style={{position:'absolute',left:'18px',top:'10px',width:'2px',height:`${(stepIdx/(STATUS_STEPS.length-1))*100}%`,background:catCfg.gradient,transition:'height 0.5s ease'}}/>
            {STATUS_STEPS.map((step,idx)=>{
              const done=idx<=stepIdx, active=idx===stepIdx;
              return (
                <div key={step.key} style={{display:'flex',alignItems:'flex-start',gap:'14px',marginBottom:idx<STATUS_STEPS.length-1?'20px':'0',position:'relative'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'50%',flexShrink:0,background:done?catCfg.gradient:'#F1F5F9',border:active?`3px solid ${catCfg.color}`:done?'none':'2px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',zIndex:1,boxShadow:active?`0 0 0 4px ${catCfg.light}`:'none',transition:'all 0.3s'}}>
                    {done?step.icon:<span style={{fontSize:'12px',color:'#94A3B8',fontWeight:700}}>{idx+1}</span>}
                  </div>
                  <div style={{paddingTop:'4px',flex:1}}>
                    <div style={{fontSize:'13px',fontWeight:active?800:done?700:600,color:active?catCfg.color:done?'#0F172A':'#94A3B8'}}>
                      {step.label}{active&&<span style={{marginLeft:'6px',fontSize:'10px',background:catCfg.light,color:catCfg.color,padding:'1px 6px',borderRadius:'999px',fontWeight:800}}>CURRENT</span>}
                    </div>
                    <div style={{fontSize:'11.5px',color:done?'#64748B':'#CBD5E1',marginTop:'2px'}}>{step.desc}</div>
                    {active&&item.updatedAt&&<div style={{fontSize:'10px',color:catCfg.color,marginTop:'3px',fontWeight:700}}>📅 Updated: {item.updatedAt}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {(item.descriptionRaw||item.description)&&(
          <div style={{margin:'16px 24px 0',padding:'14px',background:'#F8FAFC',borderRadius:'12px'}}>
            <div style={{fontSize:'11px',fontWeight:800,color:'#64748B',textTransform:'uppercase',marginBottom:'6px'}}>Your Complaint</div>
            <p style={{fontSize:'13px',color:'#334155',lineHeight:1.6,margin:0}}>"{(item.descriptionRaw||item.description||'').substring(0,280)}"</p>
          </div>
        )}
        <div style={{margin:'14px 24px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          {[
            {label:'Department',  value:item.department||'Civic Services', bg:'#F0FDF4', col:'#059669'},
            {label:'SLA Deadline',value:item.slaDeadline||'24–48 Hours',   bg:'#FFF7ED', col:'#D97706'},
            {label:'Upvotes',     value:`👍 ${item.upvotes||1} neighbours`, bg:'#EFF6FF', col:'#2563EB'},
            {label:'Priority',    value:item.urgency==='CRITICAL'?'🔴 Critical':item.urgency==='HIGH'?'🟠 High':'🟢 Normal', bg:'#F5F3FF', col:'#7C3AED'},
          ].map(info=>(
            <div key={info.label} style={{padding:'12px',background:info.bg,borderRadius:'10px'}}>
              <div style={{fontSize:'10px',fontWeight:800,color:info.col,textTransform:'uppercase',marginBottom:'3px'}}>{info.label}</div>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0F172A'}}>{info.value}</div>
            </div>
          ))}
        </div>
        <div style={{padding:'18px 24px 24px',display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button onClick={()=>upvoteGrievance(item.id)} style={{flex:1,minWidth:'110px',height:'44px',borderRadius:'12px',border:'2px solid #E2E8F0',background:'#F8FAFC',cursor:'pointer',fontSize:'13px',fontWeight:700,color:'#334155',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
            <ThumbsUp style={{width:'15px',height:'15px'}}/> Upvote
          </button>
          <Link to={`/citizen/complaints/${item.id}`} style={{flex:2,minWidth:'160px',height:'44px',borderRadius:'12px',background:catCfg.gradient,color:'#fff',fontWeight:800,fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',textDecoration:'none'}}>
            {item.status==='RESOLVED'?'✅ Verify the Fix':'🔍 Full Detail & Track'} <ArrowRight style={{width:'15px',height:'15px'}}/>
          </Link>
        </div>
      </div>
    </div>
  );
}

function GrievanceCard({item,citizen,onOpen,upvoteGrievance}) {
  const catCfg = getCatConfig(item);
  const stepIdx = getStepIndex(item.status);
  const isMine = item.citizenId===citizen?.id||(item.citizenName&&citizen?.name&&item.citizenName.toLowerCase()===citizen.name.toLowerCase());
  return (
    <div onClick={()=>onOpen(item)} style={{borderRadius:'16px',overflow:'hidden',cursor:'pointer',border:'1.5px solid #E2E8F0',background:'#fff',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',transition:'transform 0.2s,box-shadow 0.2s'}}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 12px 28px rgba(0,0,0,0.12)';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.06)';}}>
      <div style={{background:catCfg.gradient,padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'40px',height:'40px',borderRadius:'12px',background:'rgba(255,255,255,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>{catCfg.emoji}</div>
          <div>
            <div style={{color:'rgba(255,255,255,0.8)',fontSize:'10px',fontWeight:700,textTransform:'uppercase'}}>{catCfg.label}</div>
            <div style={{color:'#fff',fontSize:'11px',fontWeight:700,fontFamily:'monospace'}}>#{item.id?.slice(-8)||'N/A'}</div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'4px'}}>
          {isMine&&<span style={{background:'rgba(255,255,255,0.25)',color:'#fff',borderRadius:'999px',padding:'2px 8px',fontSize:'10px',fontWeight:700}}>👤 Mine</span>}
          {item.urgency==='CRITICAL'&&<span style={{background:'#FEF2F2',color:'#DC2626',borderRadius:'999px',padding:'2px 8px',fontSize:'10px',fontWeight:800}}>🔴</span>}
        </div>
      </div>
      <div style={{padding:'14px 16px'}}>
        <h3 style={{fontSize:'14px',fontWeight:800,color:'#0F172A',marginBottom:'4px',lineHeight:1.3}}>{item.title}</h3>
        <p style={{fontSize:'12px',color:'#64748B',lineHeight:1.4,marginBottom:'12px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{item.descriptionRaw||item.description||'No description available'}</p>
        <div style={{marginBottom:'10px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
            <span style={{fontSize:'10px',fontWeight:700,color:catCfg.color}}>{STATUS_STEPS[stepIdx]?.icon} {STATUS_STEPS[stepIdx]?.label}</span>
            <span style={{fontSize:'10px',color:'#94A3B8'}}>Step {stepIdx+1}/{STATUS_STEPS.length}</span>
          </div>
          <div style={{height:'5px',background:'#F1F5F9',borderRadius:'999px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${(stepIdx/(STATUS_STEPS.length-1))*100}%`,background:catCfg.gradient,borderRadius:'999px',transition:'width 0.5s ease'}}/>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'11px',color:'#94A3B8'}}>
          <span style={{display:'flex',alignItems:'center',gap:'4px'}}><MapPin style={{width:'11px',height:'11px'}}/>{item.location?.area||item.location?.ward||'Ward'}</span>
          <span style={{display:'flex',alignItems:'center',gap:'3px'}}><ThumbsUp style={{width:'11px',height:'11px'}}/>{item.upvotes||1}</span>
          <span style={{background:catCfg.light,color:catCfg.color,borderRadius:'999px',padding:'2px 8px',fontWeight:700,fontSize:'10px'}}>View Details →</span>
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

  const TABS=[
    {key:'all',           label:`All (${grievances.length})`,           color:'#0F172A'},
    {key:'my',            label:`My Reports (${myReports.length})`,      color:'#2563EB'},
    {key:'verification',  label:`Verify (${pendingVerification.length})`, color:'#D97706'},
    {key:'active',        label:'Active',                                color:'#7C3AED'},
    {key:'resolved',      label:'Resolved',                              color:'#059669'},
    {key:'notifications', label:`Alerts (${citizenNotifications.length})`,color:'#EC4899'},
  ];

  return (
    <div style={{minHeight:'calc(100vh - 72px)',background:'#F1F5F9',paddingBottom:'60px'}}>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#1E3A8A 0%,#1D4ED8 50%,#7C3AED 100%)',padding:'36px 0 52px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-40px',right:'-40px',width:'220px',height:'220px',borderRadius:'50%',background:'rgba(255,255,255,0.05)'}}/>
        <div style={{position:'absolute',bottom:'-60px',left:'8%',width:'300px',height:'300px',borderRadius:'50%',background:'rgba(255,255,255,0.04)'}}/>
        <div className="container" style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'16px',marginBottom:'28px'}}>
            <div>
              <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.15)',borderRadius:'999px',padding:'4px 12px',marginBottom:'10px'}}>
                <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'#34D399',animation:'livepulse 2s infinite'}}/>
                <span style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.9)',textTransform:'uppercase',letterSpacing:'0.5px'}}>Citizen Access Portal</span>
              </div>
              <h1 style={{fontSize:'28px',fontWeight:900,color:'#fff',margin:'0 0 6px',lineHeight:1.2}}>{greeting}, {citizen.name?.split(' ')[0]||'Citizen'} 👋</h1>
              <div style={{display:'flex',alignItems:'center',gap:'6px',color:'rgba(255,255,255,0.75)',fontSize:'13px'}}>
                <MapPin style={{width:'14px',height:'14px'}}/><span>{citizen.ward||'Ward 14'} · PIN {citizen.pincode||'110085'}</span>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              <button onClick={()=>{setFileModalCategory('');setShowFileModal(true);}} style={{height:'44px',padding:'0 20px',borderRadius:'12px',background:'#fff',color:'#1D4ED8',border:'none',fontWeight:800,fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px',boxShadow:'0 4px 12px rgba(0,0,0,0.15)'}}>
                <Plus style={{width:'16px',height:'16px'}}/> File Complaint
              </button>
              <button onClick={()=>setShowSignalModal(true)} style={{height:'44px',padding:'0 16px',borderRadius:'12px',background:'rgba(255,255,255,0.15)',color:'#fff',border:'1.5px solid rgba(255,255,255,0.3)',fontWeight:700,fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px'}}>
                📡 Civic Signal
              </button>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'12px'}}>
            {[
              {label:'My Reports',        value:myReports.length,                                                                                    icon:'📋',color:'#38BDF8',tab:'my'},
              {label:'Need Verification', value:pendingVerification.length,                                                                          icon:'⚠️',color:'#FCD34D',tab:'verification'},
              {label:'In Progress',       value:grievances.filter(g=>g.status!=='RESOLVED'&&g.status!=='RESOLVED_CONFIRMED').length,                 icon:'🔧',color:'#86EFAC',tab:'active'},
              {label:'Resolved',          value:grievances.filter(g=>g.status==='RESOLVED'||g.status==='RESOLVED_CONFIRMED').length,                icon:'✅',color:'#A78BFA',tab:'resolved'},
            ].map(s=>(
              <div key={s.tab} onClick={()=>setActiveTab(s.tab)} style={{background:'rgba(255,255,255,0.12)',backdropFilter:'blur(8px)',borderRadius:'14px',padding:'16px',cursor:'pointer',border:activeTab===s.tab?'2px solid rgba(255,255,255,0.6)':'1.5px solid rgba(255,255,255,0.15)',transition:'all 0.2s'}}>
                <div style={{fontSize:'22px',marginBottom:'6px'}}>{s.icon}</div>
                <div style={{fontSize:'28px',fontWeight:900,color:s.color,lineHeight:1,fontFamily:'monospace'}}>{s.value}</div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.7)',fontWeight:600,marginTop:'4px'}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{paddingTop:'28px'}}>

        {pendingVerification.length>0&&(
          <div style={{background:'linear-gradient(135deg,#FFFBEB,#FEF3C7)',border:'2px solid #FCD34D',borderRadius:'14px',padding:'16px 20px',marginBottom:'20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{fontSize:'28px'}}>⚠️</div>
              <div>
                <strong style={{fontSize:'14px',color:'#92400E',display:'block'}}>Action Needed: {pendingVerification.length} complaint{pendingVerification.length>1?'s':''} marked resolved</strong>
                <span style={{fontSize:'12px',color:'#B45309'}}>Field crew says work is done — please verify on ground!</span>
              </div>
            </div>
            <button onClick={()=>setActiveTab('verification')} style={{padding:'8px 18px',borderRadius:'10px',background:'#D97706',color:'#fff',border:'none',fontWeight:800,fontSize:'13px',cursor:'pointer'}}>Review Now →</button>
          </div>
        )}

        {activeWardIncident&&(
          <div style={{background:'linear-gradient(135deg,#ECFDF5,#D1FAE5)',border:'2px solid #6EE7B7',borderRadius:'14px',padding:'14px 20px',marginBottom:'24px',display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
            <Sparkles style={{width:'20px',height:'20px',color:'#059669',flexShrink:0}}/>
            <div style={{flex:1}}>
              <strong style={{fontSize:'13px',color:'#065F46',display:'block'}}>🏘️ Ward Intelligence: Active Investigation Underway</strong>
              <span style={{fontSize:'12px',color:'#047857'}}>{activeWardIncident.title} · Authorities mobilized</span>
            </div>
            <span style={{background:'#DCFCE7',color:'#166534',borderRadius:'999px',padding:'4px 12px',fontSize:'11px',fontWeight:800}}>✅ Response Active</span>
          </div>
        )}

        {/* Category Quick-file Grid */}
        <div style={{marginBottom:'32px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
            <h2 style={{fontSize:'18px',fontWeight:900,color:'#0F172A'}}>🚨 Quick File a Complaint</h2>
            <span style={{fontSize:'12px',color:'#64748B'}}>Tap any problem to report instantly</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:'12px'}}>
            {PROBLEM_CATEGORIES.map(cat=>(
              <button key={cat.key} onClick={()=>{setFileModalCategory(cat.key);setShowFileModal(true);}}
                style={{borderRadius:'16px',overflow:'hidden',cursor:'pointer',border:'none',background:'#fff',padding:0,textAlign:'left',boxShadow:'0 2px 8px rgba(0,0,0,0.07)',transition:'transform 0.2s,box-shadow 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 14px 28px rgba(0,0,0,0.14)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.07)';}}>
                <div style={{background:cat.gradient,padding:'20px 16px 16px',display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
                  <div style={{fontSize:'38px',lineHeight:1}}>{cat.emoji}</div>
                  {catCounts[cat.key]>0&&<span style={{background:'rgba(255,255,255,0.25)',color:'#fff',borderRadius:'999px',padding:'1px 8px',fontSize:'10px',fontWeight:800}}>{catCounts[cat.key]} in ward</span>}
                </div>
                <div style={{padding:'10px 12px 14px'}}>
                  <div style={{fontSize:'13px',fontWeight:800,color:'#0F172A',marginBottom:'2px'}}>{cat.label}</div>
                  <div style={{fontSize:'11px',color:'#64748B',lineHeight:1.3,marginBottom:'8px'}}>{cat.sublabel}</div>
                  <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                    <div style={{width:'20px',height:'20px',borderRadius:'50%',background:cat.gradient,display:'flex',alignItems:'center',justifyContent:'center'}}><Plus style={{width:'12px',height:'12px',color:'#fff'}}/></div>
                    <span style={{fontSize:'11px',fontWeight:800,color:cat.color}}>File Now</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Complaints */}
        <div>
          <div style={{display:'flex',gap:'8px',marginBottom:'16px',overflowX:'auto',paddingBottom:'4px',flexWrap:'wrap'}}>
            {TABS.map(tab=>(
              <button key={tab.key} onClick={()=>setActiveTab(tab.key)} style={{padding:'7px 14px',borderRadius:'999px',fontSize:'12px',fontWeight:700,border:activeTab===tab.key?'none':'1.5px solid #E2E8F0',background:activeTab===tab.key?tab.color:'#fff',color:activeTab===tab.key?'#fff':'#64748B',cursor:'pointer',whiteSpace:'nowrap',boxShadow:activeTab===tab.key?'0 4px 12px rgba(0,0,0,0.18)':'none',transition:'all 0.2s'}}>
                {tab.label}
              </button>
            ))}
            {activeTab!=='notifications'&&(
              <div style={{position:'relative',marginLeft:'auto'}}>
                <Search style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',width:'14px',height:'14px',color:'#94A3B8'}}/>
                <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search..." style={{height:'36px',borderRadius:'999px',border:'1.5px solid #E2E8F0',paddingLeft:'32px',paddingRight:'14px',fontSize:'12px',background:'#fff',width:'180px'}}/>
              </div>
            )}
          </div>

          {activeTab==='notifications'?(
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {citizenNotifications.length===0?(
                <div style={{textAlign:'center',padding:'48px',background:'#fff',borderRadius:'16px'}}><Bell style={{width:'36px',height:'36px',color:'#CBD5E1',margin:'0 auto 12px'}}/><p style={{color:'#94A3B8',fontSize:'14px'}}>No notifications yet</p></div>
              ):citizenNotifications.map(notif=>(
                <div key={notif.id} style={{background:'#fff',borderRadius:'12px',padding:'14px 18px',borderLeft:`4px solid ${notif.type==='STATUS_UPDATE'?'#10B981':notif.type==='DISPUTE'?'#EF4444':'#2563EB'}`,boxShadow:'0 1px 6px rgba(0,0,0,0.06)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px'}}>
                    <div><strong style={{fontSize:'13px',color:'#0F172A'}}>{notif.title}</strong><p style={{fontSize:'12px',color:'#64748B',marginTop:'3px',lineHeight:1.4}}>{notif.message}</p></div>
                    {notif.grievanceId&&<Link to={`/citizen/complaints/${notif.grievanceId}`} style={{fontSize:'12px',color:'#2563EB',fontWeight:700,whiteSpace:'nowrap'}}>View →</Link>}
                  </div>
                </div>
              ))}
            </div>
          ):filteredGrievances.length===0?(
            <div style={{textAlign:'center',padding:'60px',background:'#fff',borderRadius:'20px'}}>
              <FileText style={{width:'40px',height:'40px',color:'#CBD5E1',margin:'0 auto 14px'}}/>
              <p style={{color:'#64748B',fontSize:'15px',marginBottom:'16px'}}>No complaints found here.</p>
              <button onClick={()=>setShowFileModal(true)} style={{padding:'10px 24px',background:'linear-gradient(135deg,#1D4ED8,#7C3AED)',color:'#fff',borderRadius:'12px',border:'none',fontWeight:800,fontSize:'14px',cursor:'pointer'}}>+ File Your First Complaint</button>
            </div>
          ):(
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'14px'}}>
              {filteredGrievances.map(item=>(
                <GrievanceCard key={item.id} item={item} citizen={citizen} onOpen={setSelectedGrievance} upvoteGrievance={upvoteGrievance}/>
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
