
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCampaigns } from '@/hooks/useCampaigns';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useSMSService } from '@/hooks/useSMSService';
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  CreditCard,
  Plus,
  Activity,
  Users,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function EnhancedClientDashboard() {
  const { campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: credits, isLoading: creditsLoading } = useUserCredits();
  const smsService = useSMSService();

  const totalCampaigns = campaigns?.length || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
  const totalSent = campaigns?.reduce((sum, c) => sum + (c.sent_count || 0), 0) || 0;
  const totalDelivered = campaigns?.reduce((sum, c) => sum + (c.delivered_count || 0), 0) || 0;
  const deliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;

  const recentCampaigns = campaigns?.slice(0, 5) || [];

  const quickActions = [
    {
      title: "Send SMS",
      description: "Send bulk SMS messages",
      icon: MessageSquare,
      path: "/bulk-sms",
      color: "bg-blue-500"
    },
    {
      title: "Create Campaign",
      description: "Launch new messaging campaign",
      icon: Plus,
      path: "/campaigns",
      color: "bg-green-500"
    },
    {
      title: "View Analytics",
      description: "Track campaign performance",
      icon: TrendingUp,
      path: "/analytics",
      color: "bg-purple-500"
    },
    {
      title: "Buy Credits",
      description: "Purchase more SMS credits",
      icon: CreditCard,
      path: "/billing",
      color: "bg-orange-500"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (campaignsLoading || creditsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
          Welcome back
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Monitor your messaging campaigns and track performance with real-time analytics and insights.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Campaigns</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{totalCampaigns}</p>
                <p className="text-sm text-gray-500">{activeCampaigns} active</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Messages Sent</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{totalSent.toLocaleString()}</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Send className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Delivery Rate</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{deliveryRate}%</p>
                <p className="text-sm text-gray-500">{totalDelivered.toLocaleString()} delivered</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-50">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Credits Remaining</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{credits?.credits_remaining?.toLocaleString() || '0'}</p>
                <p className="text-sm text-gray-500">{credits?.credits_used?.toLocaleString() || 0} used</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Credits Warning */}
      {credits && credits.credits_remaining < 100 && (
        <Card className="border-l-4 border-l-amber-500 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">Low Credits Warning</p>
                  <p className="text-sm text-amber-700">
                    You have {credits.credits_remaining} credits remaining. Consider purchasing more to continue sending messages.
                  </p>
                </div>
              </div>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700" asChild>
                <Link to="/billing">
                  <Plus className="w-4 h-4 mr-2" />
                  Buy Credits
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <div className="xl:col-span-2">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Recent Campaigns
              </CardTitle>
              <CardDescription>
                Your latest messaging campaigns and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{campaign.name}</p>
                          <p className="text-sm text-gray-500">
                            {campaign.sent_count || 0} sent • {campaign.delivered_count || 0} delivered
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {Math.round(((campaign.delivered_count || 0) / Math.max(campaign.sent_count || 1, 1)) * 100)}%
                          </p>
                          <p className="text-xs text-gray-500">delivery</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No campaigns yet</p>
                  <Button asChild>
                    <Link to="/bulk-sms">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Campaign
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="ghost"
                    className="w-full justify-start p-4 h-auto hover:bg-white/80"
                    asChild
                  >
                    <Link to={action.path}>
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{action.title}</p>
                          <p className="text-sm text-gray-500">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
