
import React from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { CreditPurchase } from '../components/billing/CreditPurchase';
import { CreditHistory } from '../components/billing/CreditHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BillingDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Billing & Credits</h1>
          <p className="text-gray-600">Manage your account credits and billing information</p>
        </div>

        <Tabs defaultValue="purchase" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchase">Purchase Credits</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="purchase" className="mt-6">
            <CreditPurchase />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <CreditHistory />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BillingDashboard;
