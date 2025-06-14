
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { RoleBasedRoute } from '../components/auth/RoleBasedRoute';
import AdminDashboard from '../pages/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import EnhancedUserManagement from '../pages/admin/EnhancedUserManagement';
import Analytics from '../pages/admin/Analytics';
import EnhancedAnalytics from '../pages/admin/EnhancedAnalytics';
import DatabaseAdmin from '../pages/admin/DatabaseAdmin';
import SystemSettings from '../pages/admin/SystemSettings';
import SystemLogs from '../pages/admin/SystemLogs';
import Monitoring from '../pages/admin/Monitoring';
import RevenueReports from '../pages/admin/RevenueReports';
import ProjectProgress from '../pages/admin/ProjectProgress';
import UserCreation from '../pages/admin/UserCreation';
import ServicesManagement from '../pages/admin/ServicesManagement';
import SecurityConfig from '../pages/admin/SecurityConfig';
import SystemIntegrity from '../pages/admin/SystemIntegrity';
import AdvancedSecurityCenter from '../pages/admin/AdvancedSecurityCenter';
import SystemDiagnostics from '../pages/admin/SystemDiagnostics';
import EnterpriseIntegrations from '../pages/admin/EnterpriseIntegrations';
import DevOpsPipeline from '../pages/admin/DevOpsPipeline';
import ProductionSecurity from '../pages/admin/ProductionSecurity';

export function AdminRoutes() {
  return (
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/enhanced-users" element={<EnhancedUserManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/enhanced-analytics" element={<EnhancedAnalytics />} />
          <Route path="/database" element={<DatabaseAdmin />} />
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="/logs" element={<SystemLogs />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/revenue" element={<RevenueReports />} />
          <Route path="/progress" element={<ProjectProgress />} />
          <Route path="/user-creation" element={<UserCreation />} />
          <Route path="/services" element={<ServicesManagement />} />
          <Route path="/security-config" element={<SecurityConfig />} />
          <Route path="/system-integrity" element={<SystemIntegrity />} />
          <Route path="/security-center" element={<AdvancedSecurityCenter />} />
          <Route path="/system-diagnostics" element={<SystemDiagnostics />} />
          <Route path="/enterprise-integrations" element={<EnterpriseIntegrations />} />
          <Route path="/devops-pipeline" element={<DevOpsPipeline />} />
          <Route path="/production-security" element={<ProductionSecurity />} />
        </Routes>
      </RoleBasedRoute>
    </ProtectedRoute>
  );
}
