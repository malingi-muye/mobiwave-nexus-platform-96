
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  DollarSign, 
  TrendingUp,
  Server,
  Zap
} from 'lucide-react';
import { UsageAnalytics } from './UsageAnalytics';
import { RevenueAnalytics } from './RevenueAnalytics';
import { SystemPerformance } from './SystemPerformance';
import { UserBehaviorAnalytics } from './UserBehaviorAnalytics';

export function SystemAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Analytics</h2>
          <p className="text-gray-600">
            Comprehensive insights into system usage, performance, and revenue.
          </p>
        </div>
      </div>

      <Tabs defaultValue="usage" className="w-full">
        <TabsList>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Usage
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Behavior
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usage">
          <UsageAnalytics />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueAnalytics />
        </TabsContent>

        <TabsContent value="performance">
          <SystemPerformance />
        </TabsContent>

        <TabsContent value="behavior">
          <UserBehaviorAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
