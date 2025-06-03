
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MessageSquare, DollarSign, Target } from 'lucide-react';

interface MetricData {
  title: string;
  value: string | number;
  change: string;
  trend: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface PerformanceMetricsProps {
  campaignStats?: {
    totalCampaigns: number;
    totalDelivered: number;
  };
}

export function PerformanceMetrics({ campaignStats }: PerformanceMetricsProps) {
  const performanceMetrics: MetricData[] = [
    {
      title: "Total Campaigns",
      value: campaignStats?.totalCampaigns || 0,
      change: "+12%",
      trend: "up",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Messages Sent",
      value: campaignStats?.totalDelivered || 0,
      change: "+23%",
      trend: "up",
      icon: MessageSquare,
      color: "text-purple-600"
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {performanceMetrics.map((metric, index) => (
        <Card key={index} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <div className="flex items-center gap-1">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {metric.change}
                  </Badge>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-gray-50">
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
