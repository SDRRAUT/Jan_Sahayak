import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import { useApp } from './context/AppContext';

import Home from './pages/Home';
import Platform from './pages/Platform';
import Impact from './pages/Impact';
import CivicIntelligenceDashboard from './pages/CivicIntelligenceDashboard';
import CivicIncidentDetail from './pages/CivicIncidentDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import CitizenDetail from './pages/CitizenDetail';
import OfficerWorkspace from './pages/OfficerWorkspace';
import AdminHeatmap from './pages/AdminHeatmap';
import DeptAdmin from './pages/DeptAdmin';
import SuperAdmin from './pages/SuperAdmin';
import Onboarding from './pages/Onboarding';
import JanSahayakAssistant from './components/assistant/JanSahayakAssistant';

function RoleHome() {
  // Logged-in citizen or officer opening root sees the Home page with their authenticated profile
  return <Home />;
}

function CitizenSubmitRedirect() {
  const { user, token, switchDemoRole } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in as citizen, establish citizen session then open modal
    if (!token || !user || (user.role !== 'citizen' && user.role !== 'super_admin')) {
      switchDemoRole('citizen').then(() => {
        navigate('/citizen?fileGrievance=true', { replace: true });
      }).catch(() => {
        navigate('/citizen?fileGrievance=true', { replace: true });
      });
    } else {
      navigate('/citizen?fileGrievance=true', { replace: true });
    }
  }, [user, token, navigate, switchDemoRole]);

  return null;
}

// Track whether the initial page reload/refresh redirect has already been processed in this runtime
let hasHandledInitialReload = false;

export default function App() {
  const location = useLocation();
  const { user, token, role } = useApp();

  // For citizen: on every browser refresh / reload, always redirect to home page ('/')
  const [redirectOnReload] = useState(() => {
    if (hasHandledInitialReload) return false;
    try {
      const navEntry = typeof window !== 'undefined' && window.performance?.getEntriesByType?.('navigation')?.[0];
      const isReload = (navEntry && navEntry.type === 'reload') ||
        (typeof window !== 'undefined' && window.performance?.navigation?.type === 1) ||
        (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('jansahayak_page_refreshed') === 'true');

      let currentRole = role || user?.role;
      if (!currentRole && typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('jansahayk_user');
        if (raw) currentRole = JSON.parse(raw)?.role;
      }

      if (currentRole === 'citizen' && isReload && location.pathname !== '/') {
        hasHandledInitialReload = true;
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem('jansahayak_page_refreshed');
        }
        return true;
      }
    } catch (e) {}
    hasHandledInitialReload = true;
    return false;
  });

  useEffect(() => {
    // Record page refresh in sessionStorage before unload
    const handleBeforeUnload = () => {
      try {
        sessionStorage.setItem('jansahayak_page_refreshed', 'true');
      } catch (e) {}
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up flag if present
    try {
      sessionStorage.removeItem('jansahayak_page_refreshed');
    } catch (e) {}

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (redirectOnReload) {
    return <Navigate to="/" replace />;
  }

  // Full Screen Onboarding Condition:
  // 1. Explicitly navigating to /onboarding
  // 2. Or landing at root '/' when user has not passed and logged in
  const isFullScreenOnboarding = location.pathname === '/onboarding' || 
    (location.pathname === '/' && (!token || !user));

  if (isFullScreenOnboarding) {
    return <Onboarding />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Docked Civic Navbar with RBAC Switcher */}
      <Navbar />

      {/* Main Content Viewport */}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Showcase & Role-Based Root */}
          <Route path="/" element={<RoleHome />} />
          <Route path="/overview" element={<Home />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/impact" element={<Impact />} />

          {/* Civic Intelligence & Problem Discovery Suite (Authorities Only) */}
          <Route 
            path="/intelligence" 
            element={
              <ProtectedRoute allowedRoles={['civic_officer', 'officer', 'dept_admin', 'super_admin']}>
                <CivicIntelligenceDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/intelligence/incidents/:id" 
            element={
              <ProtectedRoute allowedRoles={['civic_officer', 'officer', 'dept_admin', 'super_admin']}>
                <CivicIncidentDetail />
              </ProtectedRoute>
            } 
          />
          
          {/* Authentication & Onboarding Gateway */}
          <Route path="/onboarding" element={<Onboarding />} />
          {/* /login redirects to home — login is handled via the navbar modal */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Register />} />

          {/* Citizen Routes (Role: citizen, super_admin) */}
          <Route 
            path="/citizen" 
            element={
              <ProtectedRoute allowedRoles={['citizen', 'super_admin']}>
                <CitizenDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/citizen/submit" 
            element={<CitizenSubmitRedirect />} 
          />
          <Route 
            path="/citizen/complaints/:id" 
            element={
              <ProtectedRoute allowedRoles={['citizen', 'super_admin']}>
                <CitizenDetail />
              </ProtectedRoute>
            } 
          />

          {/* Civic Officer Unified Workspace Routes (Role: civic_officer, officer, dept_admin, super_admin) */}
          <Route 
            path="/officer" 
            element={
              <ProtectedRoute allowedRoles={['civic_officer', 'officer', 'dept_admin', 'super_admin']}>
                <OfficerWorkspace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/civic-officer" 
            element={
              <ProtectedRoute allowedRoles={['civic_officer', 'officer', 'dept_admin', 'super_admin']}>
                <OfficerWorkspace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer/complaints/:id" 
            element={
              <ProtectedRoute allowedRoles={['civic_officer', 'officer', 'dept_admin', 'super_admin']}>
                <OfficerWorkspace />
              </ProtectedRoute>
            } 
          />

          {/* Geospatial Heatmap (Role: civic_officer, officer, dept_admin, super_admin) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['civic_officer', 'officer', 'dept_admin', 'super_admin']}>
                <AdminHeatmap />
              </ProtectedRoute>
            } 
          />

          {/* Department Admin Console (Role: civic_officer, dept_admin, super_admin) */}
          <Route 
            path="/admin/department" 
            element={
              <ProtectedRoute allowedRoles={['civic_officer', 'dept_admin', 'super_admin']}>
                <OfficerWorkspace defaultSection="operations" />
              </ProtectedRoute>
            } 
          />

          {/* Super Admin National/Municipal Console (Role: super_admin) */}
          <Route 
            path="/admin/super" 
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdmin />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Grounding Forest Footer */}
      <Footer />

      {/* JanSahayak Gemini AI Assistant (Accessible across Citizen, Officer & Admin) */}
      <JanSahayakAssistant />
    </div>
  );
}
