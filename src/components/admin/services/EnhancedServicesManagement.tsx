
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, DollarSign, Wrench, UserCheck, Shield, Grid, BarChart3, Zap } from 'lucide-react';
import { ServicesManagementHeader } from './ServicesManagementHeader';
import { ServiceCatalogView } from './ServiceCatalogView';
import { UserServicesMatrix } from './UserServicesMatrix';
import { UserSubscriptionsView } from './UserSubscriptionsView';
import { BillingOverview } from './BillingOverview';
import { ServiceConfigurationManager } from './ServiceConfigurationManager';
import { ServiceActivationRequests } from './ServiceActivationRequests';
import { UserServiceActivations } from './UserServiceActivations';
import { ServiceAnalyticsDashboard } from './analytics/ServiceAnalyticsDashboard';
import { ServiceAutomationHub } from './ServiceAutomationHub';
import { useRealServicesManagement } from '@/hooks/useRealServicesManagement';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name')
      .order('email');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export function EnhancedServicesManagement() {
  const { 
    services, 
    userSubscriptions, 
    isLoading, 
    toggleServiceStatus,
    isUpdating
  } = useRealServicesManagement();

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-simple'],
    queryFn: fetchUsers
  });

  const isDataLoading = isLoading || usersLoading;

  const handleToggleServiceStatus = async (subscriptionId: string, newStatus: string): Promise<void> => {
    await toggleServiceStatus({ subscriptionId, newStatus });
  };

  const handleServiceConfigured = async (serviceId: string, configuration: any): Promise<void> => {
    console.log('Configuring service:', serviceId, configuration);
  };

  return (
    <div className="space-y-6">
      <ServicesManagementHeader />

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="user-services-matrix" className="flex items-center gap-2">
            <Grid className="w-4 h-4" />
            Users & Services
          </TabsTrigger>
          <TabsTrigger value="services-catalog" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Services Catalog
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="activation-requests" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Activation Requests
          </TabsTrigger>
          <TabsTrigger value="user-activations" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            User Activations
          </TabsTrigger>
          <TabsTrigger value="user-subscriptions" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Subscriptions
          </TabsTrigger>
          <TabsTrigger value="billing-overview" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Billing Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <ServiceAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <ServiceAutomationHub />
        </TabsContent>

        <TabsContent value="user-services-matrix" className="space-y-4">
          <UserServicesMatrix />
        </TabsContent>

        <TabsContent value="services-catalog" className="space-y-4">
          <ServiceCatalogView 
            services={services} 
            isLoading={isDataLoading} 
          />
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <ServiceConfigurationManager
            services={services}
            onServiceConfigured={handleServiceConfigured}
            isLoading={isDataLoading}
          />
        </TabsContent>

        <TabsContent value="activation-requests" className="space-y-4">
          <ServiceActivationRequests />
        </TabsContent>

        <TabsContent value="user-activations" className="space-y-4">
          <UserServiceActivations />
        </TabsContent>

        <TabsContent value="user-subscriptions" className="space-y-4">
          <UserSubscriptionsView
            userSubscriptions={userSubscriptions}
            users={users}
            isLoading={isDataLoading}
            isUpdating={isUpdating}
            onToggleServiceStatus={handleToggleServiceStatus}
          />
        </TabsContent>

        <TabsContent value="billing-overview" className="space-y-4">
          <BillingOverview userSubscriptions={userSubscriptions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
