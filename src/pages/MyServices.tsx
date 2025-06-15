
import React from 'react';
import { ClientDashboardLayout } from '@/components/client/ClientDashboardLayout';
import { UserServicesCatalog } from '@/components/services/UserServicesCatalog';
import { UserSubscriptionsManager } from '@/components/services/UserSubscriptionsManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ListChecks } from 'lucide-react';

const MyServices = () => {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="catalog">
              <Package className="mr-2 h-4 w-4" />
              Available Services
            </TabsTrigger>
            <TabsTrigger value="subscriptions">
              <ListChecks className="mr-2 h-4 w-4" />
              My Subscriptions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="catalog" className="mt-6">
            <UserServicesCatalog />
          </TabsContent>
          <TabsContent value="subscriptions" className="mt-6">
            <UserSubscriptionsManager />
          </TabsContent>
        </Tabs>
      </div>
    </ClientDashboardLayout>
  );
};

export default MyServices;
