
import React from 'react';
import { ClientDashboardLayout } from './ClientDashboardLayout';
import { ClientMetrics } from '../dashboard/ClientMetrics';
import { CampaignsList } from '../dashboard/CampaignsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserCredits } from '@/hooks/useUserCredits';
import { useCampaigns } from '@/hooks/useCampaigns';
import { 
  MessageSquare, 
  Send, 
  Users, 
  BarChart3, 
  Plus, 
  ArrowRight,
  Mail,
  Phone,
  TrendingUp,
  Clock,
  CheckCircle,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function ClientDashboard() {
  const { data: credits } = useUserCredits();
  const { campaigns } = useCampaigns();

  const recentCampaigns = campaigns?.slice(0, 3) || [];
  const totalSent = campaigns?.reduce((sum, c) => sum + (c.sent_count || 0), 0) || 0;
  const totalDelivered = campaigns?.reduce((sum, c) => sum + (c.delivered_count || 0), 0) || 0;

  return (
    <ClientDashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to your Communication Hub</h1>
              <p className="text-blue-100 text-lg">
                Manage your campaigns, track performance, and grow your reach
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold">${credits?.credits_remaining?.toFixed(2) || '0.00'}</div>
                <div className="text-blue-200 text-sm">Available Credits</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <ClientMetrics />

        {/* Quick SMS Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-blue-900">Quick SMS Campaign</CardTitle>
                  <CardDescription className="text-blue-700">
                    Send instant SMS messages to your contacts
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-blue-600 text-white">New</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-800">
                <p className="mb-1">• Instant delivery to multiple recipients</p>
                <p className="mb-1">• Real-time delivery tracking</p>
                <p>• Cost-effective bulk messaging</p>
              </div>
              <Link to="/bulk-sms">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  <Send className="w-4 h-4 mr-2" />
                  Send SMS Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <CardTitle className="text-lg">SMS Campaigns</CardTitle>
              <CardDescription>Create and manage SMS marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/bulk-sms">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New SMS Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Mail className="w-8 h-8 text-purple-600" />
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <CardTitle className="text-lg">Email Campaigns</CardTitle>
              <CardDescription>Design and send email marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/email-campaigns">
                <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-50">
                  <Plus className="w-4 h-4 mr-2" />
                  New Email Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-green-600" />
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
              <CardTitle className="text-lg">Contacts</CardTitle>
              <CardDescription>Manage your contact lists and segments</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/contacts">
                <Button variant="outline" className="w-full border-green-200 hover:bg-green-50">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Contacts
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Campaigns */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Campaigns
                  </CardTitle>
                  <CardDescription>Your latest campaign activity</CardDescription>
                </div>
                <Link to="/analytics">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(campaign.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={campaign.status === 'completed' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          {campaign.sent_count || 0} sent
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No campaigns yet</p>
                  <Link to="/bulk-sms">
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Campaign
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Overview
              </CardTitle>
              <CardDescription>Your communication metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-900">Messages Delivered</div>
                      <div className="text-sm text-green-700">Successfully delivered messages</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {totalDelivered.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Send className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-semibold text-blue-900">Total Sent</div>
                      <div className="text-sm text-blue-700">All messages sent</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {totalSent.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="font-semibold text-purple-900">Delivery Rate</div>
                      <div className="text-sm text-purple-700">Success percentage</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0}%
                  </div>
                </div>

                <Link to="/analytics">
                  <Button variant="outline" className="w-full mt-4">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Status */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <MessageSquare className="w-5 h-5" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-yellow-900">
                  ${credits?.credits_remaining?.toFixed(2) || '0.00'} Credits Remaining
                </div>
                <div className="text-yellow-700">
                  Ready to power your next campaign
                </div>
              </div>
              <Link to="/billing">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Credits
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardLayout>
  );
}
