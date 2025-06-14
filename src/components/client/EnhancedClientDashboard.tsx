
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, BarChart3, Target, Zap } from 'lucide-react';
import { ClientMetrics } from '../dashboard/ClientMetrics';
import { CampaignsList } from '../dashboard/CampaignsList';
import { RecentActivity } from '../dashboard/RecentActivity';
import { RealTimeDashboard } from '../dashboard/RealTimeDashboard';
import { AdvancedCampaignAnalytics } from '../analytics/AdvancedCampaignAnalytics';

export function EnhancedClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Monitor your campaigns, track performance, and get real-time insights into your messaging activities.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Real-Time
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ClientMetrics />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CampaignsList />
            <RecentActivity />
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <RealTimeDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AdvancedCampaignAnalytics />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                System Performance Overview
                <Badge variant="outline">Beta</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Advanced performance monitoring</p>
                <p className="text-sm text-gray-400">
                  Detailed performance metrics and optimization recommendations coming soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
