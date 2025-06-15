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
  AlertTriangle
} from 'lucide-react';
import { ClientDashboardLayout } from './ClientDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useSurveys } from '@/hooks/useSurveys';
import { useContacts } from '@/hooks/useContacts';
import { useUserCredits } from '@/hooks/useUserCredits';
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
  const { credits, isLoading: creditsLoading } = useUserCredits();

  // Performance optimizations
  const { prefetchKey } = useCacheOptimization();
  const { measureRenderTime } = usePerformanceMonitoring();
  const renderStartTime = performance.now();

  React.useEffect(() => {
    // Correct usage: measure render time with no arguments
    measureRenderTime();
    // Prefetch likely next pages (simulate with string key or array as in hook)
    if (!campaignsLoading) {
      prefetchKey("campaign-analytics");
    }
  }, [campaignsLoading]);

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
          {/* Key metrics cards */}
          <KeyMetricsCards
            activeCampaigns={activeCampaigns}
            campaigns={campaigns}
            activeSurveys={activeSurveys}
            surveys={surveys}
            contacts={contacts}
            credits={credits}
            remainingCredits={remainingCredits}
          />
          {/* Quick Actions */}
          <QuickActions />
          {/* My Services */}
          <div>
            <h2 className="text-xl font-bold mt-10 mb-3">My Services</h2>
            <ServiceStatusWidget />
          </div>
          {/* Recent Activity */}
          <RecentActivity
            recentCampaigns={recentCampaigns}
            recentSurveys={recentSurveys}
            getStatusColor={getStatusColor}
          />
          {/* Real-time Update Indicator */}
          {latestUpdate && (
            <RealtimeUpdateBanner latestUpdate={latestUpdate} />
          )}
        </div>
      </ErrorBoundaryWrapper>
    </ClientDashboardLayout>
  );
}

// Extracted header as a subcomponent for clarity and maintainability
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

// Add similar extractions for KeyMetricsCards, QuickActions, RecentActivity, RealtimeUpdateBanner if you want to break out further, or keep inline if codebase small.
