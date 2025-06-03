
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';

interface ProgressItem {
  category: string;
  items: {
    name: string;
    status: 'completed' | 'in-progress' | 'pending' | 'blocked';
    progress: number;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export function ProjectProgress() {
  const progressData: ProgressItem[] = [
    {
      category: "Core Authentication & User Management",
      items: [
        { name: "Supabase Authentication Setup", status: 'completed', progress: 100, priority: 'high' },
        { name: "User Registration/Login", status: 'completed', progress: 100, priority: 'high' },
        { name: "Role-based Access Control", status: 'completed', progress: 100, priority: 'high' },
        { name: "User Profile Management", status: 'completed', progress: 95, priority: 'medium' },
        { name: "Admin User Management", status: 'completed', progress: 100, priority: 'high' }
      ]
    },
    {
      category: "SMS & Messaging Platform",
      items: [
        { name: "Mspace API Integration", status: 'completed', progress: 85, priority: 'high' },
        { name: "SMS Campaign Creation", status: 'completed', progress: 90, priority: 'high' },
        { name: "Bulk SMS Sending", status: 'completed', progress: 85, priority: 'high' },
        { name: "Message Templates", status: 'in-progress', progress: 70, priority: 'medium' },
        { name: "Campaign Scheduling", status: 'in-progress', progress: 60, priority: 'medium' },
        { name: "Delivery Reports", status: 'in-progress', progress: 75, priority: 'high' }
      ]
    },
    {
      category: "Payment & Billing System",
      items: [
        { name: "M-Pesa Integration", status: 'completed', progress: 90, priority: 'high' },
        { name: "Credit Purchase System", status: 'completed', progress: 85, priority: 'high' },
        { name: "Credit Management", status: 'completed', progress: 80, priority: 'high' },
        { name: "Transaction History", status: 'in-progress', progress: 60, priority: 'medium' },
        { name: "Invoice Generation", status: 'pending', progress: 0, priority: 'low' }
      ]
    },
    {
      category: "Analytics & Reporting",
      items: [
        { name: "Campaign Analytics", status: 'completed', progress: 85, priority: 'high' },
        { name: "User Growth Metrics", status: 'completed', progress: 80, priority: 'medium' },
        { name: "Revenue Analytics", status: 'in-progress', progress: 65, priority: 'medium' },
        { name: "Delivery Rate Analytics", status: 'completed', progress: 85, priority: 'high' },
        { name: "Custom Reports", status: 'pending', progress: 20, priority: 'low' }
      ]
    },
    {
      category: "Security & Compliance",
      items: [
        { name: "Audit Logging", status: 'completed', progress: 90, priority: 'high' },
        { name: "Data Encryption", status: 'completed', progress: 95, priority: 'high' },
        { name: "Rate Limiting", status: 'in-progress', progress: 50, priority: 'medium' },
        { name: "GDPR Compliance", status: 'pending', progress: 30, priority: 'medium' },
        { name: "Security Monitoring", status: 'in-progress', progress: 60, priority: 'high' }
      ]
    },
    {
      category: "UI/UX & Frontend",
      items: [
        { name: "Responsive Design", status: 'completed', progress: 95, priority: 'high' },
        { name: "Admin Dashboard", status: 'completed', progress: 90, priority: 'high' },
        { name: "Client Dashboard", status: 'completed', progress: 85, priority: 'high' },
        { name: "Mobile Optimization", status: 'in-progress', progress: 70, priority: 'medium' },
        { name: "Dark Mode Support", status: 'pending', progress: 0, priority: 'low' }
      ]
    },
    {
      category: "Production Readiness",
      items: [
        { name: "Error Handling", status: 'completed', progress: 80, priority: 'high' },
        { name: "Loading States", status: 'completed', progress: 85, priority: 'medium' },
        { name: "Performance Optimization", status: 'in-progress', progress: 60, priority: 'medium' },
        { name: "Environment Configuration", status: 'completed', progress: 90, priority: 'high' },
        { name: "Testing Setup", status: 'pending', progress: 10, priority: 'medium' },
        { name: "Documentation", status: 'pending', progress: 25, priority: 'medium' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'blocked': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateOverallProgress = () => {
    const allItems = progressData.flatMap(category => category.items);
    const totalProgress = allItems.reduce((sum, item) => sum + item.progress, 0);
    return Math.round(totalProgress / allItems.length);
  };

  const getCompletedCount = () => {
    return progressData.flatMap(category => category.items)
      .filter(item => item.status === 'completed').length;
  };

  const getTotalCount = () => {
    return progressData.flatMap(category => category.items).length;
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 bg-clip-text text-transparent">
          Project Development Progress
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Comprehensive overview of development status and remaining tasks for production launch.
        </p>
      </div>

      {/* Overall Progress Summary */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            {getCompletedCount()} of {getTotalCount()} tasks completed ({calculateOverallProgress()}% overall completion)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={calculateOverallProgress()} className="h-3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-900">{calculateOverallProgress()}%</h3>
              <p className="text-green-700">Overall Complete</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-900">
                {progressData.flatMap(c => c.items).filter(i => i.status === 'in-progress').length}
              </h3>
              <p className="text-blue-700">In Progress</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900">
                {progressData.flatMap(c => c.items).filter(i => i.status === 'pending').length}
              </h3>
              <p className="text-gray-700">Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Progress by Category */}
      {progressData.map((category, index) => (
        <Card key={index} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{category.category}</CardTitle>
            <CardDescription>
              {category.items.filter(i => i.status === 'completed').length} of {category.items.length} completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">{item.name}</span>
                    <Badge className={getPriorityColor(item.priority)} variant="secondary">
                      {item.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(item.status)} variant="secondary">
                      {item.status}
                    </Badge>
                    <div className="w-24">
                      <Progress value={item.progress} className="h-2" />
                    </div>
                    <span className="text-sm text-gray-500 w-12">{item.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
