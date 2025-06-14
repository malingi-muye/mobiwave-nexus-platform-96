
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Dashboard from '@/pages/Dashboard';
import { BulkSMS } from '@/components/messaging/BulkSMS';
import EmailCampaigns from '@/pages/EmailCampaigns';
import WhatsAppCampaigns from '@/pages/WhatsAppCampaigns';
import UserServices from '@/pages/UserServices';
import MySubscriptions from '@/pages/MySubscriptions';
import Contacts from '@/pages/Contacts';
import CampaignAnalytics from '@/pages/CampaignAnalytics';
import BillingDashboard from '@/pages/BillingDashboard';
import ProfileSettings from '@/pages/ProfileSettings';
import Settings from '@/pages/Settings';
import SurveyBuilder from '@/pages/SurveyBuilder';
import USSDServices from '@/pages/USSDServices';
import MpesaServices from '@/pages/MpesaServices';

export function ClientRoutes() {
  return (
    <>
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
      <Route path="/services" element={
        <ProtectedRoute>
          <UserServices />
        </ProtectedRoute>
      } />
      <Route path="/my-subscriptions" element={
        <ProtectedRoute>
          <MySubscriptions />
        </ProtectedRoute>
      } />
      <Route path="/ussd-services" element={
        <ProtectedRoute>
          <USSDServices />
        </ProtectedRoute>
      } />
      <Route path="/mpesa-services" element={
        <ProtectedRoute>
          <MpesaServices />
        </ProtectedRoute>
      } />
    </>
  );
}
