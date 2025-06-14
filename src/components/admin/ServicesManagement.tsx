
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, DollarSign } from 'lucide-react';
import { useRealServicesManagement } from '@/hooks/useRealServicesManagement';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServicesManagementHeader } from './services/ServicesManagementHeader';
import { ServiceCatalogView } from './services/ServiceCatalogView';
import { UserSubscriptionsView } from './services/UserSubscriptionsView';
import { BillingOverview } from './services/BillingOverview';

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

export function ServicesManagement() {
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

  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ServicesManagementHeader />

      <Tabs defaultValue="services-catalog" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services-catalog" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Services Catalog
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

        <TabsContent value="services-catalog" className="space-y-4">
          <ServiceCatalogView 
            services={services} 
            isLoading={isDataLoading} 
          />
        </TabsContent>

        <TabsContent value="user-subscriptions" className="space-y-4">
          <UserSubscriptionsView
            userSubscriptions={userSubscriptions}
            users={users}
            isLoading={isDataLoading}
            isUpdating={isUpdating}
            onToggleServiceStatus={toggleServiceStatus}
          />
        </TabsContent>

        <TabsContent value="billing-overview" className="space-y-4">
          <BillingOverview userSubscriptions={userSubscriptions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
