
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Users, 
  BarChart3, 
  CreditCard,
  Send,
  Clock,
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { ClientDashboardLayout } from './ClientDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useSurveys } from '@/hooks/useSurveys';
import { useContacts } from '@/hooks/useContacts';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { ErrorBoundaryWrapper } from '@/components/common/ErrorBoundaryWrapper';
import { LoadingState } from '@/components/common/LoadingState';
import { RealTimeNotifications } from '@/components/notifications/RealTimeNotifications';
import { Link } from 'react-router-dom';

export function ClientDashboard() {
  const { user } = useAuth();
  const { campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { surveys, isLoading: surveysLoading } = useSurveys();
  const { contacts, isLoading: contactsLoading } = useContacts();
  const { credits, isLoading: creditsLoading } = useUserCredits();

  const { isConnected, latestUpdate } = useRealTimeUpdates({
    userId: user?.id,
    enableNotifications: true
  });

  const activeCampaigns = campaigns?.filter(c => c.status === 'sending' || c.status === 'scheduled') || [];
  const activeSurveys = surveys?.filter(s => s.status === 'active') || [];
  const totalContacts = contacts?.length || 0;
  const remainingCredits = credits?.credits_remaining || 0;

  const recentCampaigns = campaigns?.slice(0, 3) || [];
  const recentSurveys = surveys?.slice(0, 3) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sending':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (campaignsLoading || surveysLoading || contactsLoading || creditsLoading) {
    return (
      <ClientDashboardLayout>
        <LoadingState message="Loading dashboard..." size="lg" />
      </ClientDashboardLayout>
    );
  }

  return (
    <ClientDashboardLayout>
      <ErrorBoundaryWrapper>
        <div className="space-y-6">
          {/* Header with Real-time Status */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back! Here's what's happening with your account.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>
              <RealTimeNotifications />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCampaigns.length}</div>
                <p className="text-xs text-gray-600">
                  {campaigns?.length || 0} total campaigns
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Live Surveys</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSurveys.length}</div>
                <p className="text-xs text-gray-600">
                  {surveys?.length || 0} total surveys
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalContacts}</div>
                <p className="text-xs text-gray-600">
                  Total contacts in database
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${remainingCredits.toFixed(2)}</div>
                <p className="text-xs text-gray-600">
                  Available balance
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump to your most common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/messaging/sms">
                  <Button variant="outline" className="w-full h-20 flex-col">
                    <MessageSquare className="w-6 h-6 mb-2" />
                    Send SMS
                  </Button>
                </Link>
                <Link to="/surveys">
                  <Button variant="outline" className="w-full h-20 flex-col">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    Create Survey
                  </Button>
                </Link>
                <Link to="/contacts">
                  <Button variant="outline" className="w-full h-20 flex-col">
                    <Users className="w-6 h-6 mb-2" />
                    Manage Contacts
                  </Button>
                </Link>
                <Link to="/billing">
                  <Button variant="outline" className="w-full h-20 flex-col">
                    <CreditCard className="w-6 h-6 mb-2" />
                    Top Up Credits
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Recent Campaigns</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentCampaigns.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No campaigns yet</p>
                    <Link to="/messaging/sms">
                      <Button size="sm" className="mt-2">Create your first campaign</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentCampaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <p className="text-sm text-gray-600">
                            {campaign.recipient_count} recipients
                          </p>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Recent Surveys</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentSurveys.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No surveys yet</p>
                    <Link to="/surveys">
                      <Button size="sm" className="mt-2">Create your first survey</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentSurveys.map((survey) => (
                      <div key={survey.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{survey.title}</h4>
                          <p className="text-sm text-gray-600">
                            {survey.question_flow?.length || 0} questions
                          </p>
                        </div>
                        <Badge className={getStatusColor(survey.status)}>
                          {survey.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Real-time Update Indicator */}
          {latestUpdate && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <p className="text-sm text-blue-800">
                    <strong>Live Update:</strong> {latestUpdate.type} activity detected
                    <span className="ml-2 text-blue-600">
                      {new Date(latestUpdate.timestamp).toLocaleTimeString()}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ErrorBoundaryWrapper>
    </ClientDashboardLayout>
  );
}
