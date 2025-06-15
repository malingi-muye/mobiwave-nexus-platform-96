
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickSMSFormProps {
  campaignData: any;
  setCampaignData: (data: any) => void;
  onSubmit: (status: 'draft' | 'active') => void;
  isLoading: boolean;
  estimatedCost: number;
  characterCount: number;
  smsCount: number;
}

export function QuickSMSForm({ 
  campaignData, 
  setCampaignData, 
  onSubmit, 
  isLoading, 
  estimatedCost, 
  characterCount, 
  smsCount 
}: QuickSMSFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick SMS Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={campaignData.name}
              onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              value={campaignData.content}
              onChange={(e) => setCampaignData({ ...campaignData, content: e.target.value })}
            />
            <p className="text-sm text-gray-500 mt-1">
              Characters: {characterCount} | SMS Count: {smsCount} | Cost: ${estimatedCost.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onSubmit('draft')} disabled={isLoading}>
              Save Draft
            </Button>
            <Button onClick={() => onSubmit('active')} disabled={isLoading}>
              Send Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
