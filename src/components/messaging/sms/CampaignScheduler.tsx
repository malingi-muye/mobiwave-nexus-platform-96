
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar as CalendarIcon, Play, Pause, Edit, Trash2 } from 'lucide-react';
import { format } from "date-fns";
import { toast } from 'sonner';
import { ScheduleDialog } from './ScheduleDialog';

interface ScheduledCampaign {
  id: string;
  name: string;
  content: string;
  recipients: string[];
  scheduledAt: Date;
  status: 'scheduled' | 'running' | 'paused' | 'completed' | 'failed';
  repeatType?: 'none' | 'daily' | 'weekly' | 'monthly';
  timezone: string;
  createdAt: Date;
}

interface CampaignSchedulerProps {
  campaign?: any;
  onScheduleUpdate?: (campaign: any) => void;
}

export function CampaignScheduler({ campaign, onScheduleUpdate }: CampaignSchedulerProps) {
  const [scheduledCampaigns, setScheduledCampaigns] = useState<ScheduledCampaign[]>([]);

  const scheduleNewCampaign = (selectedDate: Date, selectedTime: string, repeatType: string, timezone: string) => {
    if (!campaign) {
      toast.error('Please ensure campaign is ready');
      return;
    }

    const scheduledDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

    const newScheduledCampaign: ScheduledCampaign = {
      id: `scheduled-${Date.now()}`,
      name: campaign.name || 'Untitled Campaign',
      content: campaign.content || '',
      recipients: campaign.recipients || [],
      scheduledAt: scheduledDateTime,
      status: 'scheduled',
      repeatType: repeatType as any,
      timezone,
      createdAt: new Date()
    };

    setScheduledCampaigns(prev => [...prev, newScheduledCampaign]);
    toast.success('Campaign scheduled successfully');
  };

  const updateCampaignStatus = (id: string, status: ScheduledCampaign['status']) => {
    setScheduledCampaigns(prev => 
      prev.map(c => c.id === id ? { ...c, status } : c)
    );
    toast.success(`Campaign ${status}`);
  };

  const deleteCampaign = (id: string) => {
    setScheduledCampaigns(prev => prev.filter(c => c.id !== id));
    toast.success('Scheduled campaign deleted');
  };

  const getStatusColor = (status: ScheduledCampaign['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'running': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Scheduler</h2>
          <p className="text-gray-600">Schedule campaigns for future delivery with recurring options</p>
        </div>
        <ScheduleDialog onSchedule={scheduleNewCampaign} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Campaigns</CardTitle>
          <CardDescription>
            {scheduledCampaigns.length} campaigns scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledCampaigns.length > 0 ? (
            <div className="space-y-4">
              {scheduledCampaigns.map(scheduledCampaign => (
                <Card key={scheduledCampaign.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{scheduledCampaign.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {format(scheduledCampaign.scheduledAt, "PPP")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(scheduledCampaign.scheduledAt, "p")}
                          </div>
                          <Badge className={getStatusColor(scheduledCampaign.status)}>
                            {scheduledCampaign.status}
                          </Badge>
                          {scheduledCampaign.repeatType !== 'none' && (
                            <Badge variant="outline">
                              Repeats {scheduledCampaign.repeatType}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {scheduledCampaign.recipients.length} recipients
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {scheduledCampaign.status === 'scheduled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCampaignStatus(scheduledCampaign.id, 'running')}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        {scheduledCampaign.status === 'running' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCampaignStatus(scheduledCampaign.id, 'paused')}
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteCampaign(scheduledCampaign.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No campaigns scheduled</p>
              <p className="text-sm text-gray-400">Schedule your first campaign to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
