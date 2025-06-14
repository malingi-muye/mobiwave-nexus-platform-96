
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Gift, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useRewards } from '@/hooks/useRewards';
import { RewardCampaignBuilder } from './RewardCampaignBuilder';
import { RewardDistribution } from './RewardDistribution';

export function RewardsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const { campaigns, isLoading } = useRewards();

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalRecipients = campaigns.reduce((sum, c) => sum + c.total_recipients, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (activeTab === 'create') {
    return <RewardCampaignBuilder onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'distribute' && selectedCampaign) {
    return (
      <RewardDistribution 
        campaignId={selectedCampaign}
        onBack={() => {
          setActiveTab('overview');
          setSelectedCampaign(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rewards System</h2>
          <p className="text-gray-600">Distribute airtime and data bundles to your customers</p>
        </div>
        <Button onClick={() => setActiveTab('create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-gray-600">{activeCampaigns} active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalSpent.toLocaleString()}</div>
            <p className="text-xs text-gray-600">All campaigns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecipients.toLocaleString()}</div>
            <p className="text-xs text-gray-600">Total rewarded</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-gray-600">Distribution success</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reward Campaigns</CardTitle>
          <CardDescription>Manage your airtime and data distribution campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No reward campaigns yet</p>
              <Button onClick={() => setActiveTab('create')}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Campaign
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{campaign.name}</h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <Badge variant="outline">
                        {campaign.reward_type === 'airtime' ? '📱 Airtime' : '📊 Data'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCampaign(campaign.id);
                          setActiveTab('distribute');
                        }}
                      >
                        <Users className="w-4 h-4 mr-1" />
                        Distribute
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium">KES {campaign.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="font-medium">KES {campaign.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Spent</p>
                      <p className="font-medium">KES {campaign.spent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recipients</p>
                      <p className="font-medium">{campaign.total_recipients}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {((campaign.spent / campaign.budget) * 100).toFixed(1)}% of budget used
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
