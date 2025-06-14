import React from 'react';
import { Route } from 'react-router-dom';
import { RoleBasedRoute } from '@/components/auth/RoleBasedRoute';
import AdminDashboard from '@/pages/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import EnhancedUserManagement from '@/pages/admin/EnhancedUserManagement';
import UserCreation from '@/pages/admin/UserCreation';
import ServicesManagement from '@/pages/admin/ServicesManagement';
import SystemSettings from '@/pages/admin/SystemSettings';
import Analytics from '@/pages/admin/Analytics';
import EnhancedAnalytics from '@/pages/admin/EnhancedAnalytics';
import SystemLogs from '@/pages/admin/SystemLogs';
import SecurityConfig from '@/pages/admin/SecurityConfig';
import Monitoring from '@/pages/admin/Monitoring';
import DatabaseAdmin from '@/pages/admin/DatabaseAdmin';
import RevenueReports from '@/pages/admin/RevenueReports';
import ProjectProgress from '@/pages/admin/ProjectProgress';
import AdvancedSecurityCenter from '@/pages/admin/AdvancedSecurityCenter';
import SystemDiagnostics from '@/pages/admin/SystemDiagnostics';

export function AdminRoutes() {
  return (
    <>
      <Route path="/admin" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
          <AdminDashboard />
        </RoleBasedRoute>
      } />
      <Route path="/admin/users" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
          <UserManagement />
        </RoleBasedRoute>
      } />
      <Route path="/admin/enhanced-users" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
          <EnhancedUserManagement />
        </RoleBasedRoute>
      } />
      <Route path="/admin/user-creation" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin']}>
          <UserCreation />
        </RoleBasedRoute>
      } />
      <Route path="/admin/services" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
          <ServicesManagement />
        </RoleBasedRoute>
      } />
      <Route path="/admin/settings" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin']}>
          <SystemSettings />
        </RoleBasedRoute>
      } />
      <Route path="/admin/analytics" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
          <Analytics />
        </RoleBasedRoute>
      } />
      <Route path="/admin/enhanced-analytics" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
          <EnhancedAnalytics />
        </RoleBasedRoute>
      } />
      <Route path="/admin/logs" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin']}>
          <SystemLogs />
        </RoleBasedRoute>
      } />
      <Route path="/admin/security" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin']}>
          <SecurityConfig />
        </RoleBasedRoute>
      } />
      <Route path="/admin/monitoring" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
          <Monitoring />
        </RoleBasedRoute>
      } />
      <Route path="/admin/database" element={
        <RoleBasedRoute allowedRoles={['super_admin']}>
          <DatabaseAdmin />
        </RoleBasedRoute>
      } />
      <Route path="/admin/revenue" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
          <RevenueReports />
        </RoleBasedRoute>
      } />
      <Route path="/admin/projects" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
          <ProjectProgress />
        </RoleBasedRoute>
      } />
      <Route path="/admin/security-center" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin']}>
          <AdvancedSecurityCenter />
        </RoleBasedRoute>
      } />
      <Route path="/admin/system-health" element={
        <RoleBasedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
          <SystemDiagnostics />
        </RoleBasedRoute>
      } />
    </>
  );
}
