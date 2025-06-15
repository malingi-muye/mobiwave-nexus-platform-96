
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database,
  Server,
  Globe,
  Cpu,
  HardDrive,
  Network,
  Monitor
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function PerformanceOptimizer() {
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, response: 120, throughput: 1200 },
    { time: '04:00', cpu: 38, memory: 58, response: 115, throughput: 980 },
    { time: '08:00', cpu: 72, memory: 78, response: 180, throughput: 1850 },
    { time: '12:00', cpu: 85, memory: 82, response: 220, throughput: 2100 },
    { time: '16:00', cpu: 91, memory: 85, response: 250, throughput: 2300 },
    { time: '20:00', cpu: 76, memory: 71, response: 190, throughput: 1750 }
  ];

  const optimizationRecommendations = [
    {
      category: 'Database',
      title: 'Optimize slow queries',
      description: 'Identified 3 queries taking >2s. Add indexes on user_id and created_at columns.',
      impact: 'High',
      effort: 'Low',
      savings: '40% query time reduction',
      icon: <Database className="w-4 h-4" />
    },
    {
      category: 'API',
      title: 'Implement response caching',
      description: 'Cache frequently accessed endpoints to reduce server load.',
      impact: 'Medium',
      effort: 'Medium',
      savings: '25% response time improvement',
      icon: <Globe className="w-4 h-4" />
    },
    {
      category: 'Infrastructure',
      title: 'Scale horizontally',
      description: 'Add 2 more server instances to handle peak load.',
      impact: 'High',
      effort: 'High',
      savings: '60% load distribution',
      icon: <Server className="w-4 h-4" />
    },
    {
      category: 'Frontend',
      title: 'Optimize bundle size',
      description: 'Remove unused dependencies and implement code splitting.',
      impact: 'Medium',
      effort: 'Low',
      savings: '35% faster page loads',
      icon: <Monitor className="w-4 h-4" />
    }
  ];

  const systemMetrics = [
    { name: 'CPU Usage', current: 78, target: 70, status: 'warning' },
    { name: 'Memory Usage', current: 65, target: 80, status: 'good' },
    { name: 'Disk I/O', current: 45, target: 60, status: 'good' },
    { name: 'Network', current: 88, target: 75, status: 'critical' }
  ];

  const performanceScores = [
    { metric: 'Page Load Speed', score: 85, benchmark: 90 },
    { metric: 'API Response Time', score: 72, benchmark: 85 },
    { metric: 'Database Performance', score: 68, benchmark: 80 },
    { metric: 'User Experience', score: 91, benchmark: 95 }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{metric.name}</span>
                <Badge 
                  variant={
                    metric.status === 'good' ? 'default' : 
                    metric.status === 'warning' ? 'secondary' : 'destructive'
                  }
                  className="text-xs"
                >
                  {metric.status}
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{metric.current}%</div>
              <Progress 
                value={metric.current} 
                className={`h-2 ${
                  metric.status === 'critical' ? 'bg-red-100' : 
                  metric.status === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                }`} 
              />
              <div className="text-xs text-gray-500 mt-1">
                Target: {metric.target}%
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Real-time Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU %" />
                    <Line type="monotone" dataKey="memory" stroke="#10b981" name="Memory %" />
                    <Line type="monotone" dataKey="response" stroke="#f59e0b" name="Response Time (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationRecommendations.map((rec, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            {rec.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{rec.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {rec.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-green-600 font-medium">{rec.savings}</span>
                              <Badge 
                                variant={rec.impact === 'High' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {rec.impact} Impact
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {rec.effort} Effort
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Implement
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Performance Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceScores.map((score, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{score.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {score.score}/{score.benchmark}
                        </span>
                        {score.score >= score.benchmark ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    <Progress value={(score.score / score.benchmark) * 100} className="h-2" />
                    <div className="text-xs text-gray-500">
                      Target: {score.benchmark} | Current: {score.score}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Network className="w-4 h-4 text-red-500" />
                    <div>
                      <div className="font-medium text-sm">High Network Usage</div>
                      <div className="text-xs text-gray-600">Network usage at 88% - exceeds threshold</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Cpu className="w-4 h-4 text-yellow-500" />
                    <div>
                      <div className="font-medium text-sm">CPU Usage Warning</div>
                      <div className="text-xs text-gray-600">CPU usage at 78% - approaching limit</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Healthy Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <HardDrive className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="font-medium text-sm">Disk Performance</div>
                      <div className="text-xs text-gray-600">I/O operations within normal range</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Database className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="font-medium text-sm">Database Health</div>
                      <div className="text-xs text-gray-600">Query performance stable</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
