import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Activity,
  Zap,
  AlertTriangle,
  FileText,
  PlusCircle,
} from 'lucide-react';
import { ClientDashboardLayout } from './ClientDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns, Campaign } from '@/hooks/useCampaigns';
import { useSurveys, Survey } from '@/hooks/useSurveys';
import { useContacts, Contact } from '@/hooks/useContacts';
import { useUserCredits, UserCredits } from '@/hooks/useUserCredits';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { useCacheOptimization, usePerformanceMonitoring } from '@/hooks/usePerformanceOptimization';
import { ErrorBoundaryWrapper } from '@/components/common/ErrorBoundaryWrapper';
import { LoadingState } from '@/components/common/LoadingState';
import { RealTimeNotifications } from '@/components/notifications/RealTimeNotifications';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { Link } from 'react-router-dom';
import { ServiceStatusWidget } from './ServiceStatusWidget';

export function ClientDashboard() {
  const { user } = useAuth();
  const { campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { surveys, isLoading: surveysLoading } = useSurveys();
  const { contacts, isLoading: contactsLoading } = useContacts();
  const { data: credits, isLoading: creditsLoading } = useUserCredits();

  // Performance optimizations
  const { prefetchKey } = useCacheOptimization();
  const { measureRenderTime } = usePerformanceMonitoring();

  React.useEffect(() => {
    measureRenderTime();
    // Prefetch likely next pages
    if (!campaignsLoading) {
      prefetchKey("campaign-analytics");
    }
  }, [campaignsLoading, measureRenderTime, prefetchKey]);

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
        <div className="space-y-6 p-4 sm:p-6">
          {/* Header Section */}
          <DashboardHeader isConnected={isConnected} />

          {/* Main Metrics Grid */}
          <MetricsGrid />

          {/* Key metrics cards - this component is now defined below */}
          <KeyMetricsCards
            activeCampaignsCount={activeCampaigns.length}
            totalCampaigns={campaigns?.length || 0}
            activeSurveysCount={activeSurveys.length}
            totalContacts={totalContacts}
            remainingCredits={remainingCredits}
          />

          {/* Quick Actions - this component is now defined below */}
          <QuickActions />

          {/* My Services */}
          <div>
            <h2 className="text-xl font-bold mt-10 mb-3">My Services</h2>
            <ServiceStatusWidget />
          </div>

          {/* Recent Activity - this component is now defined below */}
          <RecentActivity
            recentCampaigns={recentCampaigns}
            recentSurveys={recentSurveys}
            getStatusColor={getStatusColor}
          />

          {/* Real-time Update Indicator - this component is now defined below */}
          {latestUpdate && (
            <RealtimeUpdateBanner latestUpdate={latestUpdate} />
          )}
        </div>
      </ErrorBoundaryWrapper>
    </ClientDashboardLayout>
  );
}

// Sub-components for ClientDashboard clarity and to fix build errors

function DashboardHeader({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">
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
  );
}

interface KeyMetricsCardsProps {
  activeCampaignsCount: number;
  totalCampaigns: number;
  activeSurveysCount: number;
  totalContacts: number;
  remainingCredits: number;
}

function KeyMetricsCards({
  activeCampaignsCount,
  totalCampaigns,
  activeSurveysCount,
  totalContacts,
  remainingCredits
}: KeyMetricsCardsProps) {
  const metrics = [
    { title: 'Active Campaigns', value: activeCampaignsCount, icon: Send, path: '/bulk-sms' },
    { title: 'Active Surveys', value: activeSurveysCount, icon: FileText, path: '/surveys' },
    { title: 'Total Contacts', value: totalContacts, icon: Users, path: '/contacts' },
    { title: 'Remaining Credits', value: `$${remainingCredits.toFixed(2)}`, icon: CreditCard, path: '/billing' }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              <Link to={metric.path} className="hover:underline">View details</Link>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: 'New Campaign', path: '/bulk-sms', icon: Send },
    { label: 'New Survey', path: '/survey-builder', icon: FileText },
    { label: 'Add Contact', path: '/contacts', icon: PlusCircle },
    { label: 'Buy Credits', path: '/billing', icon: CreditCard }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Button asChild key={index} variant="outline">
            <Link to={action.path}>
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

interface RecentActivityProps {
  recentCampaigns: Campaign[];
  recentSurveys: Survey[];
  getStatusColor: (status: string) => string;
}

function RecentActivity({ recentCampaigns, recentSurveys, getStatusColor }: RecentActivityProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>Your latest SMS campaigns.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recentCampaigns.map(campaign => (
              <li key={campaign.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">Sent: {new Date(campaign.created_at).toLocaleDateString()}</p>
                </div>
                <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
              </li>
            ))}
             {recentCampaigns.length === 0 && <p className="text-sm text-gray-500">No recent campaigns.</p>}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Surveys</CardTitle>
          <CardDescription>Your latest surveys and forms.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recentSurveys.map(survey => (
              <li key={survey.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{survey.title}</p>
                  <p className="text-sm text-muted-foreground">Created: {new Date(survey.created_at).toLocaleDateString()}</p>
                </div>
                <Badge className={getStatusColor(survey.status)}>{survey.status}</Badge>
              </li>
            ))}
             {recentSurveys.length === 0 && <p className="text-sm text-gray-500">No recent surveys.</p>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function RealtimeUpdateBanner({ latestUpdate }: { latestUpdate: any }) {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
      <Zap className="w-5 h-5 text-blue-600" />
      <div>
        <p className="font-semibold text-blue-800">Live Update</p>
        <p className="text-sm text-blue-700">{latestUpdate.message}</p>
      </div>
    </div>
  );
}
