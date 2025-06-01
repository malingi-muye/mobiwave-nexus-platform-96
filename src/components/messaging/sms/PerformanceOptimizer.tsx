
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Database, Clock, TrendingUp, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

export function PerformanceOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastOptimized, setLastOptimized] = useState<Date | null>(null);

  const performanceMetrics: PerformanceMetric[] = [
    {
      name: 'Message Processing Speed',
      value: 1250,
      target: 1000,
      unit: 'msg/min',
      status: 'good',
      description: 'Average messages processed per minute'
    },
    {
      name: 'API Response Time',
      value: 120,
      target: 200,
      unit: 'ms',
      status: 'good',
      description: 'Average API response time'
    },
    {
      name: 'Database Query Time',
      value: 45,
      target: 100,
      unit: 'ms',
      status: 'good',
      description: 'Average database query execution time'
    },
    {
      name: 'Memory Usage',
      value: 75,
      target: 80,
      unit: '%',
      status: 'warning',
      description: 'Current memory utilization'
    },
    {
      name: 'Cache Hit Rate',
      value: 92,
      target: 85,
      unit: '%',
      status: 'good',
      description: 'Percentage of requests served from cache'
    },
    {
      name: 'Error Rate',
      value: 0.5,
      target: 1,
      unit: '%',
      status: 'good',
      description: 'Percentage of failed requests'
    }
  ];

  const optimizationTasks = [
    { name: 'Clear message cache', duration: 2000 },
    { name: 'Optimize database queries', duration: 3000 },
    { name: 'Compress static assets', duration: 1500 },
    { name: 'Update routing tables', duration: 2500 },
    { name: 'Refresh connection pools', duration: 1000 }
  ];

  const runOptimization = async () => {
    setIsOptimizing(true);
    
    for (const task of optimizationTasks) {
      toast.info(`Running: ${task.name}`);
      await new Promise(resolve => setTimeout(resolve, task.duration));
    }
    
    setIsOptimizing(false);
    setLastOptimized(new Date());
    toast.success('Performance optimization completed successfully!');
  };

  const getStatusColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
    }
  };

  const getProgressColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
    }
  };

  const overallScore = useMemo(() => {
    const goodMetrics = performanceMetrics.filter(m => m.status === 'good').length;
    return Math.round((goodMetrics / performanceMetrics.length) * 100);
  }, [performanceMetrics]);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Performance Monitor
              </CardTitle>
              <CardDescription>
                Real-time system performance metrics and optimization tools
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{overallScore}%</div>
              <div className="text-sm text-gray-600">Performance Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{metric.name}</h4>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {metric.value}{metric.unit}
                      </span>
                      <span className="text-sm text-gray-500">
                        Target: {metric.target}{metric.unit}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((metric.value / metric.target) * 100, 100)}
                      className="h-2"
                    />
                    <p className="text-xs text-gray-600">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">System Optimization</h3>
              <p className="text-sm text-gray-600">
                Run automated optimization to improve performance
              </p>
              {lastOptimized && (
                <p className="text-xs text-gray-500">
                  Last optimized: {lastOptimized.toLocaleString()}
                </p>
              )}
            </div>
            <Button
              onClick={runOptimization}
              disabled={isOptimizing}
              className="flex items-center gap-2"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Run Optimization
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Performance Recommendations
          </CardTitle>
          <CardDescription>
            Automated suggestions to improve system performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Cache Optimization Active</h4>
                <p className="text-sm text-green-700">Your cache hit rate is excellent at 92%</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <Database className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Consider Memory Cleanup</h4>
                <p className="text-sm text-yellow-700">Memory usage is at 75%. Consider running cleanup routines.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Schedule Optimization</h4>
                <p className="text-sm text-blue-700">Run optimization during off-peak hours for better results.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
