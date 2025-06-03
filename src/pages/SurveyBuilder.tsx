
import React from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { SurveyBuilder as SurveyBuilderComponent } from '../components/forms/SurveyBuilder';

const SurveyBuilder = () => {
  return (
    <DashboardLayout>
      <SurveyBuilderComponent />
    </DashboardLayout>
  );
};

export default SurveyBuilder;
