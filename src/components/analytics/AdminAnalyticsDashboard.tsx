
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserEngagementAnalytics } from './UserEngagementAnalytics';
import { ServiceAdoptionMetrics } from './ServiceAdoptionMetrics';
import { RevenueAnalytics } from './RevenueAnalytics';
import { SystemMonitoring } from '../monitoring/SystemMonitoring';

export function AdminAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 bg-clip-text text-transparent">
            Analytics & Monitoring
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Comprehensive analytics dashboard with user engagement, service adoption, revenue metrics, and system monitoring.
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="adoption">Service Adoption</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="monitoring">System Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <UserEngagementAnalytics />
        </TabsContent>

        <TabsContent value="adoption" className="space-y-4">
          <ServiceAdoptionMetrics />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <RevenueAnalytics />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <SystemMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  );
}
