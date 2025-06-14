
import React, { useState } from 'react';
import { StatusCards } from './sms/StatusCards';
import { TabNavigation } from './sms/TabNavigation';
import { EnhancedRecipientManager } from './sms/EnhancedRecipientManager';
import { CampaignScheduler } from './sms/CampaignScheduler';
import { CampaignHistory } from './sms/CampaignHistory';
import { CampaignManager } from './sms/CampaignManager';
import { RealTimeTracker } from './sms/RealTimeTracker';
import { BulkOperations } from './sms/BulkOperations';
import { AdvancedAnalytics } from './sms/AdvancedAnalytics';
import { MessagePersonalizer } from './sms/MessagePersonalizer';
import { CreditPurchase } from '../billing/CreditPurchase';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, BarChart3, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'react-router-dom';

export function BulkSMS() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'compose';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentCampaign, setCurrentCampaign] = useState(null);

  const handleCampaignSuccess = () => {
    setActiveTab('tracking');
  };

  const handleSchedule = (scheduledTime: Date) => {
    console.log('Campaign scheduled for:', scheduledTime);
    // Handle scheduling logic here
  };

  const handleSendNow = () => {
    console.log('Sending campaign immediately');
    // Handle immediate send logic here
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SMS Campaign Suite
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Send SMS campaigns with advanced personalization, scheduling, and real-time tracking via Mspace API.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setActiveTab('billing')}>
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Buy Credits</span>
            <span className="sm:hidden">Credits</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setActiveTab('advanced-analytics')}>
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Full Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </Button>
          <Button 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => setActiveTab('compose')}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Quick SMS</span>
            <span className="sm:hidden">New SMS</span>
          </Button>
        </div>
      </div>

      {/* Quick Start Guide */}
      {activeTab === 'compose' && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Info className="w-5 h-5" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-blue-800">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span>Write your message</span>
              </div>
              <div className="flex items-center gap-2 text-blue-800">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span>Add recipients</span>
              </div>
              <div className="flex items-center gap-2 text-blue-800">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span>Review & send</span>
              </div>
              <div className="flex items-center gap-2 text-blue-800">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <span>Track delivery</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <StatusCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabNavigation />

        <TabsContent value="compose" className="mt-6">
          <CampaignManager onSuccess={handleCampaignSuccess} />
        </TabsContent>

        <TabsContent value="personalize" className="mt-6">
          <MessagePersonalizer 
            message={currentCampaign?.content || ''}
            onMessageChange={(message) => 
              setCurrentCampaign(prev => ({ ...prev, content: message }))
            }
            contacts={currentCampaign?.recipients || []}
          />
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
            onSchedule={handleSchedule}
            onSendNow={handleSendNow}
          />
        </TabsContent>

        <TabsContent value="tracking" className="mt-6">
          <div className="space-y-6">
            <RealTimeTracker />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AdvancedAnalytics />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <CampaignHistory />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <CreditPurchase />
        </TabsContent>

        <TabsContent value="advanced-analytics" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
