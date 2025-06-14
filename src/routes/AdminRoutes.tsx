
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RoleBasedRoute } from '../components/auth/RoleBasedRoute';
import AdminDashboard from '../pages/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import Analytics from '../pages/admin/Analytics';
import SystemSettings from '../pages/admin/SystemSettings';
import DatabaseAdmin from '../pages/admin/DatabaseAdmin';
import SystemLogs from '../pages/admin/SystemLogs';
import Monitoring from '../pages/admin/Monitoring';
import SecurityConfig from '../pages/admin/SecurityConfig';
import ServicesManagement from '../pages/admin/ServicesManagement';
import RevenueReports from '../pages/admin/RevenueReports';
import SystemIntegrity from '../pages/admin/SystemIntegrity';
import AdvancedAnalytics from '../pages/AdvancedAnalytics';
import ApiManagement from '../pages/ApiManagement';

export function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/admin/dashboard"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminDashboard />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <UserManagement />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <Analytics />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/advanced-analytics"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <AdvancedAnalytics />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <ServicesManagement />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <SystemSettings />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/database"
        element={
          <RoleBasedRoute allowedRoles={['super_admin']}>
            <DatabaseAdmin />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <SystemLogs />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/monitoring"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <Monitoring />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/security"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <SecurityConfig />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/revenue"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <RevenueReports />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/integrity"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <SystemIntegrity />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/api"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <ApiManagement />
          </RoleBasedRoute>
        }
      />
    </Routes>
  );
}
