
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Gift, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useRewards } from '@/hooks/useRewards';
import { RewardCampaignBuilder } from './RewardCampaignBuilder';
import { RewardDistribution } from './RewardDistribution';

export function RewardsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const { campaigns, isLoading } = useRewards();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalRecipients = campaigns.reduce((sum, campaign) => sum + campaign.total_recipients, 0);

  if (activeTab === 'builder') {
    return <RewardCampaignBuilder onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'distribution' && selectedCampaign) {
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
          <p className="text-gray-600">Manage your reward campaigns and distributions</p>
        </div>
        <Button onClick={() => setActiveTab('builder')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
            <p className="text-xs text-gray-600">Currently running</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalBudget.toLocaleString()}</div>
            <p className="text-xs text-gray-600">Allocated funds</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalSpent.toLocaleString()}</div>
            <p className="text-xs text-gray-600">Distributed rewards</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecipients}</div>
            <p className="text-xs text-gray-600">Total beneficiaries</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reward Campaigns</CardTitle>
          <CardDescription>Manage your reward campaigns and track distributions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">No reward campaigns created yet</p>
              <Button onClick={() => setActiveTab('builder')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Campaign
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
                        {campaign.reward_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCampaign(campaign.id);
                          setActiveTab('distribution');
                        }}
                      >
                        <Users className="w-4 h-4 mr-1" />
                        Distribute
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-gray-600">Reward Amount</p>
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
