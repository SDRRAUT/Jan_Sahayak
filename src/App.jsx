import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Platform from './pages/Platform';
import Impact from './pages/Impact';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import CitizenSubmit from './pages/CitizenSubmit';
import CitizenDetail from './pages/CitizenDetail';
import OfficerWorkspace from './pages/OfficerWorkspace';
import AdminHeatmap from './pages/AdminHeatmap';
import DeptAdmin from './pages/DeptAdmin';
import SuperAdmin from './pages/SuperAdmin';
import Leaderboard from './pages/Leaderboard';
import Notifications from './pages/Notifications';
import Onboarding from './pages/Onboarding';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Floating Frosted Pill Navbar with RBAC Switcher */}
      <Navbar />

      {/* Main Content Viewport */}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Showcase & Information */}
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/intelligence" element={<Platform />} />
          <Route path="/impact" element={<Impact />} />
          
          {/* Authentication Gateway */}
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
            path="/citizen/complaints" 
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
            path="/citizen/file-grievance" 
            element={
              <ProtectedRoute allowedRoles={['citizen', 'super_admin']}>
                <CitizenSubmit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/citizen/notifications" 
            element={
              <ProtectedRoute allowedRoles={['citizen', 'super_admin']}>
                <Notifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/citizen/leaderboard" 
            element={
              <ProtectedRoute allowedRoles={['citizen', 'super_admin']}>
                <Leaderboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/citizen/complaints/:id" element={<CitizenDetail />} />

          {/* Government Officer Routes (Role: officer, dept_admin, super_admin) */}
          <Route 
            path="/officer" 
            element={
              <ProtectedRoute allowedRoles={['officer', 'dept_admin', 'super_admin']}>
                <OfficerWorkspace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer/complaints/:id" 
            element={
              <ProtectedRoute allowedRoles={['officer', 'dept_admin', 'super_admin']}>
                <OfficerWorkspace />
              </ProtectedRoute>
            } 
          />

          {/* Geospatial Heatmap (Role: officer, dept_admin, super_admin) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['officer', 'dept_admin', 'super_admin']}>
                <AdminHeatmap />
              </ProtectedRoute>
            } 
          />

          {/* Department Admin Console (Role: dept_admin, super_admin) */}
          <Route 
            path="/admin/department" 
            element={
              <ProtectedRoute allowedRoles={['dept_admin', 'super_admin']}>
                <DeptAdmin />
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
