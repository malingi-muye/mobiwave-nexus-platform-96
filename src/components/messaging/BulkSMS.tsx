
import React, { useState } from 'react';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { MessageComposer } from './sms/MessageComposer';
import { EnhancedRecipientManager } from './sms/EnhancedRecipientManager';
import { CampaignScheduler } from './sms/CampaignScheduler';
import { DeliveryTracker } from './sms/DeliveryTracker';
import { CampaignHistory } from './sms/CampaignHistory';
import { CampaignManager } from './sms/CampaignManager';
import { RealTimeTracker } from './sms/RealTimeTracker';
import { BulkOperations } from './sms/BulkOperations';
import { AdvancedAnalytics } from './sms/AdvancedAnalytics';
import { ABTesting } from './sms/ABTesting';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Clock, Users, BarChart, Plus, Activity, DollarSign, Layers, Zap, FlaskConical, TrendingUp } from 'lucide-react';
import { useMspaceApi } from '@/hooks/useMspaceApi';
import { useUserCredits } from '@/hooks/useUserCredits';

export function BulkSMS() {
  const [activeTab, setActiveTab] = useState('compose');
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const { checkBalance } = useMspaceApi();
  const { data: credits } = useUserCredits();

  const handleCampaignSuccess = () => {
    setActiveTab('tracking');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Advanced SMS Campaign Center
            </h1>
            <p className="text-gray-600 mt-2">
              Complete SMS campaign management with analytics, A/B testing, scheduling, and real-time tracking via Mspace API.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setActiveTab('analytics')}>
              <TrendingUp className="w-4 h-4" />
              Analytics
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setActiveTab('ab-testing')}>
              <FlaskConical className="w-4 h-4" />
              A/B Testing
            </Button>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setActiveTab('compose')}
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Enhanced Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Your Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  ${credits?.credits_remaining?.toFixed(2) || '0.00'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Available balance</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Mspace Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                {checkBalance.data ? (
                  <span className="text-2xl font-bold text-purple-600">
                    {checkBalance.data.currency} {checkBalance.data.balance}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">Loading...</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Provider balance</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Bulk operations running</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Zap className="w-3 h-3 mr-1" />
                  Enhanced
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">All systems optimal</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Compose
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
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="mt-6">
            <CampaignManager onSuccess={handleCampaignSuccess} />
          </TabsContent>

          <TabsContent value="recipients" className="mt-6">
            <EnhancedRecipientManager 
              onRecipientsUpdate={(recipients) => 
                setCurrentCampaign(prev => ({ ...prev, recipients }))
              }
              recipients={currentCampaign?.recipients || []}
            />
          </TabsContent>

          <TabsContent value="bulk-ops" className="mt-6">
            <BulkOperations />
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <CampaignScheduler 
              campaign={currentCampaign}
              onScheduleUpdate={setCurrentCampaign}
            />
          </TabsContent>

          <TabsContent value="tracking" className="mt-6">
            <div className="space-y-6">
              <RealTimeTracker />
              <DeliveryTracker campaigns={[currentCampaign].filter(Boolean)} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AdvancedAnalytics />
          </TabsContent>

          <TabsContent value="ab-testing" className="mt-6">
            <ABTesting />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <CampaignHistory />
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Template management is integrated into the Recipients tab</p>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('recipients')}
                className="mt-4"
              >
                Go to Template Manager
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
