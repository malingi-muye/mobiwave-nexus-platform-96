
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { SurveyDashboard } from '../components/surveys/SurveyDashboard';

const Surveys = () => {
  return (
    <ClientDashboardLayout>
      <SurveyDashboard />
    </ClientDashboardLayout>
  );
};

export default Surveys;
