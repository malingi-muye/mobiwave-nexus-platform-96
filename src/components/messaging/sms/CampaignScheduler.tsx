
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Send, Timer } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface CampaignSchedulerProps {
  campaign: any;
  onScheduleUpdate: (campaign: any) => void;
}

export function CampaignScheduler({ campaign, onScheduleUpdate }: CampaignSchedulerProps) {
  const [scheduleType, setScheduleType] = useState('immediate');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [timezone, setTimezone] = useState('UTC');

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Dubai',
    'Africa/Nairobi'
  ];

  const handleScheduleUpdate = () => {
    const scheduleData = {
      type: scheduleType,
      date: selectedDate,
      time: selectedTime,
      timezone,
      scheduledAt: scheduleType === 'scheduled' && selectedDate ? 
        new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`) : null
    };
    
    onScheduleUpdate({
      ...campaign,
      schedule: scheduleData
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Campaign Scheduling
          </CardTitle>
          <CardDescription>
            Choose when to send your SMS campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={scheduleType} onValueChange={setScheduleType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate" className="flex items-center gap-2 cursor-pointer">
                <Send className="w-4 h-4 text-green-600" />
                Send Immediately
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="scheduled" id="scheduled" />
              <Label htmlFor="scheduled" className="flex items-center gap-2 cursor-pointer">
                <Timer className="w-4 h-4 text-orange-600" />
                Schedule for Later
              </Label>
            </div>
          </RadioGroup>

          {scheduleType === 'scheduled' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="time">Select Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDate && (
                <div className="p-3 bg-white rounded-md border">
                  <p className="text-sm font-medium text-gray-700 mb-1">Scheduled for:</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime} ({timezone})
                  </p>
                </div>
              )}
            </div>
          )}

          <Button 
            onClick={handleScheduleUpdate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Update Schedule
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-purple-600" />
            Campaign Summary
          </CardTitle>
          <CardDescription>
            Review your campaign details before sending
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Campaign Name:</span>
              <span className="text-sm text-gray-900">{campaign?.name || 'Untitled Campaign'}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Recipients:</span>
              <Badge variant="secondary">{campaign?.recipients?.length || 0} contacts</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Sender ID:</span>
              <span className="text-sm text-gray-900">{campaign?.senderId || 'Not set'}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Message Length:</span>
              <Badge variant={campaign?.smsCount > 1 ? "destructive" : "secondary"}>
                {campaign?.smsCount || 0} SMS parts
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Schedule:</span>
              <Badge variant={scheduleType === 'immediate' ? "default" : "outline"}>
                {scheduleType === 'immediate' ? 'Send Now' : 'Scheduled'}
              </Badge>
            </div>
          </div>

          {campaign?.message && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Message Preview:</p>
              <p className="text-sm text-gray-900 italic">"{campaign.message.substring(0, 100)}{campaign.message.length > 100 ? '...' : ''}"</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">Estimated Cost:</span>
              <span className="font-semibold text-green-600">
                ${((campaign?.recipients?.length || 0) * (campaign?.smsCount || 1) * 0.05).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
