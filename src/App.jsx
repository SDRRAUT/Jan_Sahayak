import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import CitizenSubmit from './pages/CitizenSubmit';
import CitizenDetail from './pages/CitizenDetail';
import OfficerWorkspace from './pages/OfficerWorkspace';
import AdminHeatmap from './pages/AdminHeatmap';
import DeptAdmin from './pages/DeptAdmin';
import SuperAdmin from './pages/SuperAdmin';
import Onboarding from './pages/Onboarding';

function RoleHome() {
  const { user, token } = useApp();
  if (token && user) {
    if (user.role === 'citizen') return <Navigate to="/citizen" replace />;
    if (user.role === 'civic_officer' || user.role === 'officer' || user.role === 'dept_admin') return <Navigate to="/officer" replace />;
    if (user.role === 'super_admin') return <Navigate to="/admin/super" replace />;
  }
  // Public visitor who entered the app sees the rich Home showcase
  return <Home />;
}

export default function App() {
  const location = useLocation();
  const { user, token, hasEnteredApp } = useApp();

  // Full Screen Onboarding Condition:
  // 1. Explicitly navigating to /onboarding
  // 2. Or landing at root '/' when user has NOT entered the app yet (and not logged in)
  const isFullScreenOnboarding = location.pathname === '/onboarding' || 
    (location.pathname === '/' && !hasEnteredApp && !token);

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
          <Route path="/login" element={<Login />} />
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
            element={
              <ProtectedRoute allowedRoles={['citizen', 'super_admin']}>
                <CitizenSubmit />
              </ProtectedRoute>
            } 
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
    </div>
  );
}
