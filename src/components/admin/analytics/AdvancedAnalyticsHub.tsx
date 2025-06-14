
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RealTimeMetricsDashboard } from './RealTimeMetricsDashboard';
import { PerformanceOptimizer } from './PerformanceOptimizer';
import { PredictiveAnalytics } from './PredictiveAnalytics';
import { 
  Activity, 
  Zap, 
  Brain, 
  BarChart3, 
  TrendingUp, 
  Clock,
  AlertTriangle
} from 'lucide-react';

export function AdvancedAnalyticsHub() {
  const [activeTab, setActiveTab] = useState('realtime');

  const analyticsOverview = {
    systemHealth: 94,
    performanceScore: 87,
    predictionAccuracy: 91,
    optimizationsActive: 8
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 bg-clip-text text-transparent">
          Advanced Analytics Hub
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Real-time monitoring, performance optimization, and AI-powered predictive analytics for your platform.
        </p>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">System Health</p>
                <p className={`text-3xl font-bold ${getHealthColor(analyticsOverview.systemHealth)}`}>
                  {analyticsOverview.systemHealth}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">Excellent</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Performance Score</p>
                <p className={`text-3xl font-bold ${getHealthColor(analyticsOverview.performanceScore)}`}>
                  {analyticsOverview.performanceScore}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600">Good</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-yellow-50">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">AI Accuracy</p>
                <p className={`text-3xl font-bold ${getHealthColor(analyticsOverview.predictionAccuracy)}`}>
                  {analyticsOverview.predictionAccuracy}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Brain className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-purple-600">High</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Optimizations</p>
                <p className="text-3xl font-bold text-blue-600">
                  {analyticsOverview.optimizationsActive}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-600">Running</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common analytics and optimization tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              System Health Check
            </Button>
            <Button variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Performance Scan
            </Button>
            <Button variant="outline" size="sm">
              <Brain className="w-4 h-4 mr-2" />
              Generate Predictions
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Analytics
            </Button>
            <Button variant="outline" size="sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alert Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Real-Time Metrics
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Predictive AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-6">
          <RealTimeMetricsDashboard />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceOptimizer />
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <PredictiveAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
