
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthPage } from "./components/auth/AuthPage";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Client Dashboard Routes */}
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
            
            {/* Admin Dashboard Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute>
                  <SystemSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/database" 
              element={
                <ProtectedRoute>
                  <DatabaseAdmin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/revenue" 
              element={
                <ProtectedRoute>
                  <RevenueReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/logs" 
              element={
                <ProtectedRoute>
                  <SystemLogs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/monitoring" 
              element={
                <ProtectedRoute>
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
);

export default App;
