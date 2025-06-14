
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
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

export const adminRoutes = [
  <Route
    key="admin-redirect"
    path="/admin"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <Navigate to="/admin/dashboard" replace />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-dashboard"
    path="/admin/dashboard"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <AdminDashboard />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-users"
    path="/admin/users"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <UserManagement />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-analytics"
    path="/admin/analytics"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <Analytics />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-advanced-analytics"
    path="/admin/advanced-analytics"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <AdvancedAnalytics />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-services"
    path="/admin/services"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <ServicesManagement />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-settings"
    path="/admin/settings"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <SystemSettings />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-database"
    path="/admin/database"
    element={
      <RoleBasedRoute allowedRoles={['super_admin']}>
        <DatabaseAdmin />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-logs"
    path="/admin/logs"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <SystemLogs />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-monitoring"
    path="/admin/monitoring"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <Monitoring />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-security"
    path="/admin/security"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <SecurityConfig />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-revenue"
    path="/admin/revenue"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <RevenueReports />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-integrity"
    path="/admin/integrity"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <SystemIntegrity />
      </RoleBasedRoute>
    }
  />,
  <Route
    key="admin-api"
    path="/admin/api"
    element={
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <ApiManagement />
      </RoleBasedRoute>
    }
  />
];
