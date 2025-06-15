
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCheck, Shield, Grid } from 'lucide-react';
import { UserServicesMatrix } from './UserServicesMatrix';
import { ServiceActivationRequests } from './ServiceActivationRequests';
import { UserServiceActivations } from './UserServiceActivations';
import { UserSubscriptionsView } from './UserSubscriptionsView';
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

export function UserServicesManagement() {
  const { 
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

  return (
    <Tabs defaultValue="matrix" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="matrix" className="flex items-center gap-2">
          <Grid className="w-4 h-4" />
          Users & Services Matrix
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
      </TabsList>

      <TabsContent value="matrix" className="space-y-4">
        <UserServicesMatrix />
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
    </Tabs>
  );
}
