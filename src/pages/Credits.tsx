
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, History, Plus } from 'lucide-react';

const Credits = () => {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Credits & Billing</h2>
          <p className="text-muted-foreground">
            Manage your account credits and billing information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,250 Credits</div>
              <p className="text-sm text-muted-foreground">
                Approximately 1,250 SMS messages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Purchase Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" />
                Buy Credits
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Usage History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <button className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90">
                View History
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientDashboardLayout>
  );
};

export default Credits;
