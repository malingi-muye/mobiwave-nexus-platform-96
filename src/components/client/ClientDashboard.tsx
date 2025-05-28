
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Mail,
  Phone,
  Calendar,
  DollarSign
} from "lucide-react";

export const ClientDashboard = () => {
  const messagingStats = {
    totalSent: "12,847",
    deliveryRate: "98.5%",
    openRate: "76.2%",
    clickRate: "23.4%",
    credits: 5420,
    creditsUsed: 2580
  };

  const recentCampaigns = [
    {
      id: 1,
      name: "Summer Sale 2024",
      type: "SMS",
      status: "completed",
      sent: 2500,
      delivered: 2465,
      opened: 1890,
      date: "2024-05-27"
    },
    {
      id: 2,
      name: "Product Launch Email",
      type: "Email",
      status: "active",
      sent: 5000,
      delivered: 4950,
      opened: 3800,
      date: "2024-05-26"
    },
    {
      id: 3,
      name: "Customer Survey",
      type: "WhatsApp",
      status: "scheduled",
      sent: 0,
      delivered: 0,
      opened: 0,
      date: "2024-05-29"
    }
  ];

  const quickActions = [
    { title: "Send SMS Campaign", icon: Phone, color: "bg-blue-500", path: "/bulk-sms" },
    { title: "Email Campaign", icon: Mail, color: "bg-green-500", path: "/bulk-email" },
    { title: "WhatsApp Broadcast", icon: MessageSquare, color: "bg-emerald-500", path: "/whatsapp" },
    { title: "Schedule Campaign", icon: Calendar, color: "bg-purple-500", path: "/campaigns" }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      completed: "bg-green-100 text-green-800 border-green-200",
      active: "bg-blue-100 text-blue-800 border-blue-200",
      scheduled: "bg-yellow-100 text-yellow-800 border-yellow-200",
      paused: "bg-gray-100 text-gray-800 border-gray-200"
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.paused}>
        {status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "active":
        return <Send className="w-4 h-4 text-blue-500" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Admin User!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your messaging campaigns and performance.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Messages Sent</p>
                <p className="text-2xl font-bold text-gray-900">{messagingStats.totalSent}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-green-600">+12%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivery Rate</p>
                <p className="text-2xl font-bold text-gray-900">{messagingStats.deliveryRate}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-green-600">+0.8%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">{messagingStats.openRate}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-green-600">+5.2%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Credits Left</p>
                <p className="text-2xl font-bold text-gray-900">{messagingStats.credits.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={(messagingStats.credits / (messagingStats.credits + messagingStats.creditsUsed)) * 100} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{messagingStats.creditsUsed} used this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Start a new campaign or manage your messaging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors"
                onClick={() => window.location.href = action.path}
              >
                <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-center">{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Campaigns */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Campaigns</span>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardTitle>
          <CardDescription>
            Track the performance of your latest messaging campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(campaign.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                      <p className="text-sm text-gray-500">{campaign.type} • {campaign.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(campaign.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Sent</p>
                    <p className="text-sm font-medium text-gray-900">{campaign.sent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Delivered</p>
                    <p className="text-sm font-medium text-gray-900">{campaign.delivered.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Opened</p>
                    <p className="text-sm font-medium text-gray-900">{campaign.opened.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            Message delivery and engagement metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Performance charts will be displayed here</p>
              <p className="text-sm text-gray-400">Connect your analytics for detailed insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
