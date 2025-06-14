
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Users, Gift } from 'lucide-react';
import { useRewards, useRewardDistributions } from '@/hooks/useRewards';
import { toast } from 'sonner';

interface RewardDistributionProps {
  campaignId: string;
  onBack: () => void;
}

export function RewardDistribution({ campaignId, onBack }: RewardDistributionProps) {
  const [recipients, setRecipients] = useState('');
  const { campaigns, distributeReward, isDistributing } = useRewards();
  const { distributions, isLoading } = useRewardDistributions(campaignId);

  const campaign = campaigns.find(c => c.id === campaignId);

  const handleDistribute = async () => {
    const phoneNumbers = recipients
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (phoneNumbers.length === 0) {
      toast.error('Please enter at least one phone number');
      return;
    }

    if (!campaign) {
      toast.error('Campaign not found');
      return;
    }

    const totalCost = phoneNumbers.length * campaign.amount;
    const remainingBudget = campaign.budget - campaign.spent;

    if (totalCost > remainingBudget) {
      toast.error(`Insufficient budget. Required: KES ${totalCost}, Available: KES ${remainingBudget}`);
      return;
    }

    try {
      await distributeReward({ campaignId, recipients: phoneNumbers });
      setRecipients('');
    } catch (error) {
      console.error('Failed to distribute rewards:', error);
    }
  };

  if (!campaign) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Campaign not found</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    );
  }

  const recipientCount = recipients.split('\n').filter(line => line.trim().length > 0).length;
  const estimatedCost = recipientCount * campaign.amount;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Distribute Rewards</h2>
          <p className="text-gray-600">{campaign.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Recipients</CardTitle>
            <CardDescription>Enter phone numbers (one per line)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="+254712345678&#10;+254787654321&#10;+254723456789"
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500">
                Enter phone numbers in international format (+254...)
              </p>
            </div>

            {recipientCount > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Recipients:</span>
                  <span className="font-medium">{recipientCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount per recipient:</span>
                  <span className="font-medium">KES {campaign.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total cost:</span>
                  <span className="font-medium">KES {estimatedCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining budget:</span>
                  <span className="font-medium">KES {campaign.budget - campaign.spent}</span>
                </div>
              </div>
            )}

            <Button 
              onClick={handleDistribute} 
              disabled={recipientCount === 0 || isDistributing}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {isDistributing ? 'Distributing...' : `Distribute to ${recipientCount} Recipients`}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Info</CardTitle>
            <CardDescription>Current campaign details and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Campaign:</span>
                <span className="font-medium">{campaign.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Reward Type:</span>
                <Badge variant="outline">
                  {campaign.reward_type === 'airtime' ? '📱 Airtime' : '📊 Data Bundle'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">KES {campaign.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Budget:</span>
                <span className="font-medium">KES {campaign.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Spent:</span>
                <span className="font-medium">KES {campaign.spent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Recipients:</span>
                <span className="font-medium">{campaign.total_recipients}</span>
              </div>
            </div>

            <div className="pt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full" 
                  style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {((campaign.spent / campaign.budget) * 100).toFixed(1)}% of budget used
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {distributions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribution History</CardTitle>
            <CardDescription>Recent reward distributions for this campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {distributions.slice(0, 10).map((distribution) => (
                <div key={distribution.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Gift className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="font-medium">{distribution.recipient_phone}</p>
                      <p className="text-sm text-gray-500">
                        KES {distribution.amount} • {new Date(distribution.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    className={
                      distribution.status === 'completed' ? 'bg-green-100 text-green-800' :
                      distribution.status === 'failed' ? 'bg-red-100 text-red-800' :
                      distribution.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {distribution.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
