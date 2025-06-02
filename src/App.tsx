
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthPage } from "./components/auth/AuthPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import DatabaseAdmin from "./pages/admin/DatabaseAdmin";
import Analytics from "./pages/admin/Analytics";
import RevenueReports from "./pages/admin/RevenueReports";
import SystemLogs from "./pages/admin/SystemLogs";
import Monitoring from "./pages/admin/Monitoring";
import NotFound from "./pages/NotFound";
import { BulkSMS } from "./components/messaging/BulkSMS";
import SecurityConfig from "./pages/admin/SecurityConfig";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    }
  }
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Client Dashboard Routes - Default for end_user role */}
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
              
              {/* Admin Dashboard Routes - Require admin role */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
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
                path="/admin/security" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <SecurityConfig />
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
                path="/admin/analytics" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Analytics />
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
              
              {/* Redirect legacy routes to appropriate dashboards */}
              <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="/client-dashboard" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
