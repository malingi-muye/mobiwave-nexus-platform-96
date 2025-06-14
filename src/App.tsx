
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/components/auth/AuthProvider';
import NotFound from '@/pages/NotFound';

// Public pages
import Index from '@/pages/Index';
import { AuthPage } from '@/components/auth/AuthPage';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';

// Client pages
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import BulkSMS from './pages/BulkSMS';
import Contacts from './pages/Contacts';
import WhatsAppCampaigns from './pages/WhatsAppCampaigns';
import EmailCampaigns from './pages/EmailCampaigns';
import CampaignAnalytics from './pages/CampaignAnalytics';
import ProfileSettings from './pages/ProfileSettings';
import BillingDashboard from './pages/BillingDashboard';
import SurveyBuilder from './pages/SurveyBuilder';
import Surveys from './pages/Surveys';
import ServiceDesk from './pages/ServiceDesk';
import UserServices from './pages/UserServices';
import USSDServices from './pages/USSDServices';
import MpesaServices from './pages/MpesaServices';
import MySubscriptions from './pages/MySubscriptions';

// Admin pages
import { RoleBasedRoute } from './components/auth/RoleBasedRoute';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import Analytics from './pages/admin/Analytics';
import SystemSettings from './pages/admin/SystemSettings';
import DatabaseAdmin from './pages/admin/DatabaseAdmin';
import SystemLogs from './pages/admin/SystemLogs';
import Monitoring from './pages/admin/Monitoring';
import SecurityConfig from './pages/admin/SecurityConfig';
import ServicesManagement from './pages/admin/ServicesManagement';
import RevenueReports from './pages/admin/RevenueReports';
import SystemIntegrity from './pages/admin/SystemIntegrity';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import ApiManagement from './pages/ApiManagement';

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
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />

              {/* Client Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bulk-sms"
                element={
                  <ProtectedRoute>
                    <BulkSMS />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contacts"
                element={
                  <ProtectedRoute>
                    <Contacts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/whatsapp"
                element={
                  <ProtectedRoute>
                    <WhatsAppCampaigns />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/email"
                element={
                  <ProtectedRoute>
                    <EmailCampaigns />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <CampaignAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/surveys"
                element={
                  <ProtectedRoute>
                    <Surveys />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/survey-builder"
                element={
                  <ProtectedRoute>
                    <SurveyBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/service-desk"
                element={
                  <ProtectedRoute>
                    <ServiceDesk />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-services"
                element={
                  <ProtectedRoute>
                    <UserServices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ussd"
                element={
                  <ProtectedRoute>
                    <USSDServices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mpesa"
                element={
                  <ProtectedRoute>
                    <MpesaServices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscriptions"
                element={
                  <ProtectedRoute>
                    <MySubscriptions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <ProtectedRoute>
                    <BillingDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
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
