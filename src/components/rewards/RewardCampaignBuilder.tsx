
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from 'lucide-react';
import { useRewards } from '@/hooks/useRewards';
import { toast } from 'sonner';

interface RewardCampaignBuilderProps {
  onBack: () => void;
}

export function RewardCampaignBuilder({ onBack }: RewardCampaignBuilderProps) {
  const [campaignData, setCampaignData] = useState({
    name: '',
    reward_type: 'airtime' as const,
    amount: 0,
    budget: 0,
    criteria: {}
  });

  const { createCampaign, isCreating } = useRewards();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignData.name || campaignData.amount <= 0 || campaignData.budget <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createCampaign({
        ...campaignData,
        status: 'draft',
        spent: 0,
        total_recipients: 0,
        successful_distributions: 0
      });
      onBack();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Create Reward Campaign</h2>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Set up your airtime or data bundle distribution campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={campaignData.name}
                onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Customer Appreciation Rewards"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reward_type">Reward Type</Label>
                <Select 
                  value={campaignData.reward_type} 
                  onValueChange={(value) => setCampaignData(prev => ({ ...prev, reward_type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="airtime">📱 Airtime</SelectItem>
                    <SelectItem value="data_bundle">📊 Data Bundle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount per Recipient (KES)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={campaignData.amount}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="50"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Total Budget (KES)</Label>
              <Input
                id="budget"
                type="number"
                value={campaignData.budget}
                onChange={(e) => setCampaignData(prev => ({ ...prev, budget: Number(e.target.value) }))}
                placeholder="10000"
                min="1"
                required
              />
            </div>

            {campaignData.amount > 0 && campaignData.budget > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Estimated Recipients:</strong> {Math.floor(campaignData.budget / campaignData.amount)} people
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isCreating}>
                <Save className="w-4 h-4 mr-2" />
                {isCreating ? 'Creating...' : 'Create Campaign'}
              </Button>
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
