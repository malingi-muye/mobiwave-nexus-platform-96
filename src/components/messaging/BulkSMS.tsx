
import React, { useState } from 'react';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { StatusCards } from './sms/StatusCards';
import { TabNavigation } from './sms/TabNavigation';
import { EnhancedRecipientManager } from './sms/EnhancedRecipientManager';
import { CampaignScheduler } from './sms/CampaignScheduler';
import { DeliveryTracker } from './sms/DeliveryTracker';
import { CampaignHistory } from './sms/CampaignHistory';
import { CampaignManager } from './sms/CampaignManager';
import { RealTimeTracker } from './sms/RealTimeTracker';
import { BulkOperations } from './sms/BulkOperations';
import { AdvancedAnalytics } from './sms/AdvancedAnalytics';
import { ABTesting } from './sms/ABTesting';
import { MessagePersonalizer } from './sms/MessagePersonalizer';
import { NotificationCenter } from './sms/NotificationCenter';
import { PerformanceOptimizer } from './sms/PerformanceOptimizer';
import { CreditPurchase } from '../billing/CreditPurchase';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Bell, Zap, DollarSign, BarChart3 } from 'lucide-react';

export function BulkSMS() {
  const [activeTab, setActiveTab] = useState('compose');
  const [currentCampaign, setCurrentCampaign] = useState(null);

  const handleCampaignSuccess = () => {
    setActiveTab('tracking');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professional SMS Campaign Suite
            </h1>
            <p className="text-gray-600 mt-2">
              Complete SMS campaign management with advanced personalization, analytics, A/B testing, scheduling, and real-time tracking via Mspace API.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setActiveTab('billing')}>
              <DollarSign className="w-4 h-4" />
              Buy Credits
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setActiveTab('advanced-analytics')}>
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setActiveTab('notifications')}>
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setActiveTab('performance')}>
              <Zap className="w-4 h-4" />
              Performance
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

          <TabsContent value="advanced-analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="ab-testing" className="mt-6">
            <ABTesting />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <CampaignHistory />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <PerformanceOptimizer />
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <CreditPurchase />
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
