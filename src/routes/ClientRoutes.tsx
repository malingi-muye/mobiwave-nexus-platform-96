
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import BulkSMS from '../pages/BulkSMS';
import Contacts from '../pages/Contacts';
import WhatsAppCampaigns from '../pages/WhatsAppCampaigns';
import EmailCampaigns from '../pages/EmailCampaigns';
import CampaignAnalytics from '../pages/CampaignAnalytics';
import ProfileSettings from '../pages/ProfileSettings';
import BillingDashboard from '../pages/BillingDashboard';
import SurveyBuilder from '../pages/SurveyBuilder';
import Surveys from '../pages/Surveys';
import ServiceDesk from '../pages/ServiceDesk';
import UserServices from '../pages/UserServices';
import USSDServices from '../pages/USSDServices';
import MpesaServices from '../pages/MpesaServices';
import MySubscriptions from '../pages/MySubscriptions';

export function ClientRoutes() {
  return (
    <Routes>
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
        path="/services"
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
    </Routes>
  );
}
