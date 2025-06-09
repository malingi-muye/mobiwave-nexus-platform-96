
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleBasedRoute } from '@/components/auth/RoleBasedRoute';

// Public pages
import Index from '@/pages/Index';
import { AuthPage } from '@/components/auth/AuthPage';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

// Client pages
import Dashboard from '@/pages/Dashboard';
import { BulkSMS } from '@/components/messaging/BulkSMS';
import EmailCampaigns from '@/pages/EmailCampaigns';
import WhatsAppCampaigns from '@/pages/WhatsAppCampaigns';
import Contacts from '@/pages/Contacts';
import CampaignAnalytics from '@/pages/CampaignAnalytics';
import BillingDashboard from '@/pages/BillingDashboard';
import ProfileSettings from '@/pages/ProfileSettings';
import Settings from '@/pages/Settings';
import SurveyBuilder from '@/pages/SurveyBuilder';

// Admin pages
import AdminDashboard from '@/pages/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import ServicesManagement from '@/pages/admin/ServicesManagement';
import SystemSettings from '@/pages/admin/SystemSettings';
import Analytics from '@/pages/admin/Analytics';
import SystemLogs from '@/pages/admin/SystemLogs';
import SecurityConfig from '@/pages/admin/SecurityConfig';
import Monitoring from '@/pages/admin/Monitoring';
import DatabaseAdmin from '@/pages/admin/DatabaseAdmin';
import RevenueReports from '@/pages/admin/RevenueReports';
import ProjectProgress from '@/pages/admin/ProjectProgress';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />

              {/* Client protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/bulk-sms" element={
                <ProtectedRoute>
                  <BulkSMS />
                </ProtectedRoute>
              } />
              <Route path="/email-campaigns" element={
                <ProtectedRoute>
                  <EmailCampaigns />
                </ProtectedRoute>
              } />
              <Route path="/whatsapp-campaigns" element={
                <ProtectedRoute>
                  <WhatsAppCampaigns />
                </ProtectedRoute>
              } />
              <Route path="/contacts" element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <CampaignAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/billing" element={
                <ProtectedRoute>
                  <BillingDashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/surveys" element={
                <ProtectedRoute>
                  <SurveyBuilder />
                </ProtectedRoute>
              } />

              {/* Admin protected routes - Allow super_admin, admin, and manager */}
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

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
