
import React from 'react';
import { Route } from 'react-router-dom';
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
import USSDServices from '../pages/USSDServices';
import MpesaServices from '../pages/MpesaServices';
import ServiceRequests from '../pages/ServiceRequests';
import MyServices from '../pages/MyServices';

export const clientRoutes = [
  <Route
    key="dashboard"
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="bulk-sms"
    path="/bulk-sms"
    element={
      <ProtectedRoute>
        <BulkSMS />
      </ProtectedRoute>
    }
  />,
  <Route
    key="contacts"
    path="/contacts"
    element={
      <ProtectedRoute>
        <Contacts />
      </ProtectedRoute>
    }
  />,
  <Route
    key="whatsapp"
    path="/whatsapp"
    element={
      <ProtectedRoute>
        <WhatsAppCampaigns />
      </ProtectedRoute>
    }
  />,
  <Route
    key="email"
    path="/email"
    element={
      <ProtectedRoute>
        <EmailCampaigns />
      </ProtectedRoute>
    }
  />,
  <Route
    key="analytics"
    path="/analytics"
    element={
      <ProtectedRoute>
        <CampaignAnalytics />
      </ProtectedRoute>
    }
  />,
  <Route
    key="surveys"
    path="/surveys"
    element={
      <ProtectedRoute>
        <Surveys />
      </ProtectedRoute>
    }
  />,
  <Route
    key="survey-builder"
    path="/survey-builder"
    element={
      <ProtectedRoute>
        <SurveyBuilder />
      </ProtectedRoute>
    }
  />,
  <Route
    key="service-desk"
    path="/service-desk"
    element={
      <ProtectedRoute>
        <ServiceDesk />
      </ProtectedRoute>
    }
  />,
  <Route
    key="my-services"
    path="/my-services"
    element={
      <ProtectedRoute>
        <MyServices />
      </ProtectedRoute>
    }
  />,
  <Route
    key="ussd"
    path="/ussd"
    element={
      <ProtectedRoute>
        <USSDServices />
      </ProtectedRoute>
    }
  />,
  <Route
    key="mpesa"
    path="/mpesa"
    element={
      <ProtectedRoute>
        <MpesaServices />
      </ProtectedRoute>
    }
  />,
  <Route
    key="billing"
    path="/billing"
    element={
      <ProtectedRoute>
        <BillingDashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="profile"
    path="/profile"
    element={
      <ProtectedRoute>
        <ProfileSettings />
      </ProtectedRoute>
    }
  />,
  <Route
    key="service-requests"
    path="/service-requests"
    element={
      <ProtectedRoute>
        <ServiceRequests />
      </ProtectedRoute>
    }
  />
];
