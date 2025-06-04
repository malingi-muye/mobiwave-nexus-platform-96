
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";

// Import components
import Index from './pages/Index';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import EmailCampaigns from './pages/EmailCampaigns';
import WhatsAppCampaigns from './pages/WhatsAppCampaigns';
import SurveyBuilder from './pages/SurveyBuilder';
import CampaignAnalytics from './pages/CampaignAnalytics';
import BillingDashboard from './pages/BillingDashboard';
import Settings from './pages/Settings';
import ProfileSettings from './pages/ProfileSettings';
import NotFound from './pages/NotFound';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/admin/Analytics';
import UserManagement from './pages/admin/UserManagement';
import SystemSettings from './pages/admin/SystemSettings';
import SystemLogs from './pages/admin/SystemLogs';
import Monitoring from './pages/admin/Monitoring';
import DatabaseAdmin from './pages/admin/DatabaseAdmin';
import RevenueReports from './pages/admin/RevenueReports';
import SecurityConfig from './pages/admin/SecurityConfig';
import ProjectProgress from './pages/admin/ProjectProgress';

// Auth components
import { AuthProvider } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthPage } from './components/auth/AuthPage';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <Toaster />
          <ErrorBoundary>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Protected user routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
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
                  path="/campaigns"
                  element={
                    <ProtectedRoute>
                      <EmailCampaigns />
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
                  path="/survey-builder"
                  element={
                    <ProtectedRoute>
                      <SurveyBuilder />
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
                  path="/billing"
                  element={
                    <ProtectedRoute>
                      <BillingDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
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

                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <SystemSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/logs"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <SystemLogs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/monitoring"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Monitoring />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/database"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <DatabaseAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/revenue"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <RevenueReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/security"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <SecurityConfig />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/projects"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <ProjectProgress />
                    </ProtectedRoute>
                  }
                />

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </ErrorBoundary>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
