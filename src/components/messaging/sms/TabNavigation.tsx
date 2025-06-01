
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Clock, Users, BarChart, Plus, Activity, TrendingUp, Bell, Wand2, Layers, Zap, FlaskConical } from 'lucide-react';

export function TabNavigation() {
  return (
    <TabsList className="grid w-full grid-cols-12 bg-white/50 backdrop-blur-sm">
      <TabsTrigger value="compose" className="flex items-center gap-2">
        <Send className="w-4 h-4" />
        Compose
      </TabsTrigger>
      <TabsTrigger value="personalize" className="flex items-center gap-2">
        <Wand2 className="w-4 h-4" />
        Personalize
      </TabsTrigger>
      <TabsTrigger value="recipients" className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        Recipients
      </TabsTrigger>
      <TabsTrigger value="bulk-ops" className="flex items-center gap-2">
        <Layers className="w-4 h-4" />
        Bulk Ops
      </TabsTrigger>
      <TabsTrigger value="schedule" className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Schedule
      </TabsTrigger>
      <TabsTrigger value="tracking" className="flex items-center gap-2">
        <Activity className="w-4 h-4" />
        Live Tracking
      </TabsTrigger>
      <TabsTrigger value="analytics" className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Analytics
      </TabsTrigger>
      <TabsTrigger value="ab-testing" className="flex items-center gap-2">
        <FlaskConical className="w-4 h-4" />
        A/B Testing
      </TabsTrigger>
      <TabsTrigger value="history" className="flex items-center gap-2">
        <BarChart className="w-4 h-4" />
        History
      </TabsTrigger>
      <TabsTrigger value="notifications" className="flex items-center gap-2">
        <Bell className="w-4 h-4" />
        Notifications
      </TabsTrigger>
      <TabsTrigger value="performance" className="flex items-center gap-2">
        <Zap className="w-4 h-4" />
        Performance
      </TabsTrigger>
      <TabsTrigger value="templates" className="flex items-center gap-2">
        <BarChart className="w-4 h-4" />
        Templates
      </TabsTrigger>
    </TabsList>
  );
}
