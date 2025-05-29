
import React, { useState } from 'react';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { MessageComposer } from './sms/MessageComposer';
import { RecipientManager } from './sms/RecipientManager';
import { CampaignScheduler } from './sms/CampaignScheduler';
import { DeliveryTracker } from './sms/DeliveryTracker';
import { CampaignHistory } from './sms/CampaignHistory';
import { CampaignManager } from './sms/CampaignManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Send, Clock, Users, BarChart, Plus } from 'lucide-react';

export function BulkSMS() {
  const [activeTab, setActiveTab] = useState('compose');
  const [currentCampaign, setCurrentCampaign] = useState(null);

  const handleCampaignSuccess = () => {
    setActiveTab('history');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bulk SMS Campaign
            </h1>
            <p className="text-gray-600 mt-2">
              Create, manage, and track your SMS campaigns with advanced personalization and scheduling.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Analytics
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="recipients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recipients
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="mt-6">
            <CampaignManager onSuccess={handleCampaignSuccess} />
          </TabsContent>

          <TabsContent value="recipients" className="mt-6">
            <RecipientManager 
              onRecipientsUpdate={(recipients) => 
                setCurrentCampaign(prev => ({ ...prev, recipients }))
              }
              recipients={currentCampaign?.recipients || []}
            />
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <CampaignScheduler 
              campaign={currentCampaign}
              onScheduleUpdate={setCurrentCampaign}
            />
          </TabsContent>

          <TabsContent value="tracking" className="mt-6">
            <DeliveryTracker campaigns={[currentCampaign].filter(Boolean)} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <CampaignHistory />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
