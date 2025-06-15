import { Routes, Route } from 'react-router-dom';
import { RoleBasedRoute } from '../components/auth/RoleBasedRoute';
import AdminDashboard from '../pages/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import ServicesManagement from '../pages/admin/ServicesManagement';
import SystemSettings from '../pages/admin/SystemSettings';
import SecurityConfig from '../pages/admin/SecurityConfig';
import Analytics from '../pages/admin/Analytics';
import Monitoring from '../pages/admin/Monitoring';
import UserCreation from '../pages/admin/UserCreation';
import EnhancedUserManagement from '../pages/admin/EnhancedUserManagement';
import RevenueReports from '../pages/admin/RevenueReports';
import DatabaseAdmin from '../pages/admin/DatabaseAdmin';
import SystemLogs from '../pages/admin/SystemLogs';
import ProjectProgress from '../pages/admin/ProjectProgress';
import SystemDiagnostics from '../pages/admin/SystemDiagnostics';
import RealTimeMonitoring from '../pages/admin/RealTimeMonitoring';
import AdvancedAnalytics from '../pages/admin/AdvancedAnalytics';
import EnhancedAnalytics from '../pages/admin/EnhancedAnalytics';
import SystemHealth from '../pages/admin/SystemHealth';
import AdvancedSecurityCenter from '../pages/admin/AdvancedSecurityCenter';
import NotificationCenter from '../pages/admin/NotificationCenter';
import SystemIntegrity from '../pages/admin/SystemIntegrity';
import ApiManagement from '../pages/ApiManagement';

export function AdminRoutes() {
  return (
    <Routes>
      <Route 
        path="/admin" 
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
        path="/admin/users/enhanced" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <EnhancedUserManagement />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/users/create" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <UserCreation />
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
        path="/admin/security" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <SecurityConfig />
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
        path="/admin/analytics/enhanced" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <EnhancedAnalytics />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/analytics/advanced" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <AdvancedAnalytics />
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
        path="/admin/monitoring/realtime" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <RealTimeMonitoring />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/security/advanced" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <AdvancedSecurityCenter />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/system/integrity" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <SystemIntegrity />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/system/health" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <SystemHealth />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/system/diagnostics" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <SystemDiagnostics />
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
        path="/admin/database" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
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
        path="/admin/project" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <ProjectProgress />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/notifications" 
        element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <NotificationCenter />
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
