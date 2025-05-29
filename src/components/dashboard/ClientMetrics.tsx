
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCampaigns } from '@/hooks/useCampaigns';
import { useUserCredits } from '@/hooks/useUserCredits';
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  CreditCard,
  Plus
} from 'lucide-react';

export function ClientMetrics() {
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: credits, isLoading: creditsLoading } = useUserCredits();

  const totalCampaigns = campaigns?.length || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
  const totalSent = campaigns?.reduce((sum, c) => sum + c.sent_count, 0) || 0;
  const totalDelivered = campaigns?.reduce((sum, c) => sum + c.delivered_count, 0) || 0;
  const deliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;

  const metrics = [
    {
      title: 'Total Campaigns',
      value: totalCampaigns.toString(),
      description: `${activeCampaigns} active`,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Messages Sent',
      value: totalSent.toLocaleString(),
      description: 'This month',
      icon: Send,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Delivery Rate',
      value: `${deliveryRate}%`,
      description: `${totalDelivered.toLocaleString()} delivered`,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Credits Remaining',
      value: credits?.credits_remaining?.toLocaleString() || '0',
      description: `${credits?.credits_used?.toLocaleString() || 0} used`,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (campaignsLoading || creditsLoading) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-500">{metric.description}</p>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Buy Credits
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
