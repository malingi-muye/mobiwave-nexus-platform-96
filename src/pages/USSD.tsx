
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Settings, Code, BarChart3 } from 'lucide-react';

const USSD = () => {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">USSD Services</h2>
          <p className="text-muted-foreground">
            Create and manage USSD applications and services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                USSD Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Build interactive USSD menus and applications.
              </p>
              <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Create Application
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Menu Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Design USSD menu flows with our visual builder.
              </p>
              <button className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90">
                Open Builder
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track USSD session analytics and performance.
              </p>
              <button className="w-full bg-accent text-accent-foreground px-4 py-2 rounded-md hover:bg-accent/90">
                View Analytics
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientDashboardLayout>
  );
};

export default USSD;
