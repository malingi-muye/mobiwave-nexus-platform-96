
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import SMS from "./pages/SMS";
import USSD from "./pages/USSD";
import Surveys from "./pages/Surveys";
import Credits from "./pages/Credits";
import Settings from "./pages/Settings";
import CampaignAnalytics from "./pages/CampaignAnalytics";
import ClientAnalytics from "./pages/ClientAnalytics";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Services from "./pages/admin/Services";
import Analytics from "./pages/admin/Analytics";
import AdvancedAnalyticsAdmin from "./pages/admin/AdvancedAnalytics";
import Monitoring from "./pages/admin/Monitoring";
import Security from "./pages/admin/Security";
import AdminSettings from "./pages/admin/Settings";
import SMSManagement from "./pages/admin/SMSManagement";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Client Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/sms" element={<SMS />} />
              <Route path="/ussd" element={<USSD />} />
              <Route path="/surveys" element={<Surveys />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/campaign-analytics" element={<CampaignAnalytics />} />
              <Route path="/client-analytics" element={<ClientAnalytics />} />
              <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/services" element={<Services />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/advanced-analytics" element={<AdvancedAnalyticsAdmin />} />
              <Route path="/admin/monitoring" element={<Monitoring />} />
              <Route path="/admin/security" element={<Security />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/sms" element={<SMSManagement />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
