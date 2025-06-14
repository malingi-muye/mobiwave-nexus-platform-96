
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Database, 
  Server, 
  Globe, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react';

interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'database' | 'caching' | 'network' | 'security';
  implemented: boolean;
  estimatedImprovement: string;
}

export function PerformanceOptimizer() {
  const [autoOptimizations, setAutoOptimizations] = useState({
    queryOptimization: true,
    cacheManagement: true,
    connectionPooling: false,
    compressionEnabled: true,
    cdnOptimization: false
  });

  const [recommendations] = useState<OptimizationRecommendation[]>([
    {
      id: '1',
      title: 'Enable Database Query Caching',
      description: 'Cache frequently accessed queries to reduce database load',
      impact: 'high',
      category: 'database',
      implemented: false,
      estimatedImprovement: '40% faster query response'
    },
    {
      id: '2',
      title: 'Implement Redis Caching Layer',
      description: 'Add Redis for session management and data caching',
      impact: 'high',
      category: 'caching',
      implemented: true,
      estimatedImprovement: '60% reduction in response time'
    },
    {
      id: '3',
      title: 'Optimize Connection Pooling',
      description: 'Configure optimal database connection pool settings',
      impact: 'medium',
      category: 'database',
      implemented: false,
      estimatedImprovement: '25% better resource utilization'
    },
    {
      id: '4',
      title: 'Enable GZIP Compression',
      description: 'Compress API responses to reduce bandwidth usage',
      impact: 'medium',
      category: 'network',
      implemented: true,
      estimatedImprovement: '50% smaller payload sizes'
    },
    {
      id: '5',
      title: 'Implement Rate Limiting',
      description: 'Protect against abuse and ensure fair resource usage',
      impact: 'high',
      category: 'security',
      implemented: false,
      estimatedImprovement: '90% reduction in abuse attempts'
    }
  ]);

  const systemMetrics = {
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    networkThroughput: 234,
    activeConnections: 156,
    cacheHitRate: 89
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database': return <Database className="w-4 h-4" />;
      case 'caching': return <Zap className="w-4 h-4" />;
      case 'network': return <Network className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Performance Optimizer</h3>
        <p className="text-gray-600">Monitor system performance and apply optimizations</p>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="optimizations">Auto Optimizations</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Load</span>
                    <span className="font-medium">{systemMetrics.cpuUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.cpuUsage} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {systemMetrics.cpuUsage < 50 ? 'Optimal' : systemMetrics.cpuUsage < 80 ? 'Moderate' : 'High'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <HardDrive className="w-4 h-4 text-green-600" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>RAM Utilization</span>
                    <span className="font-medium">{systemMetrics.memoryUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.memoryUsage} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {systemMetrics.memoryUsage < 70 ? 'Good' : 'Consider optimization'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Network className="w-4 h-4 text-purple-600" />
                  Network I/O
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Throughput</span>
                    <span className="font-medium">{systemMetrics.networkThroughput} MB/s</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {systemMetrics.activeConnections} active connections
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Database className="w-4 h-4 text-orange-600" />
                  Database Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Query Response</span>
                    <span className="font-medium text-green-600">45ms avg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active Connections</span>
                    <span className="font-medium">{systemMetrics.activeConnections}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  Cache Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hit Rate</span>
                    <span className="font-medium text-green-600">{systemMetrics.cacheHitRate}%</span>
                  </div>
                  <Progress value={systemMetrics.cacheHitRate} className="h-2" />
                  <div className="text-xs text-gray-500">Excellent performance</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-teal-600" />
                  API Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Avg Response</span>
                    <span className="font-medium text-green-600">120ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span className="font-medium text-green-600">99.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gray-50">
                      {getCategoryIcon(rec.category)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge className={getImpactColor(rec.impact)}>
                          {rec.impact} impact
                        </Badge>
                        {rec.implemented && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Implemented
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                      <p className="text-sm font-medium text-blue-600">{rec.estimatedImprovement}</p>
                    </div>
                  </div>
                  <Button 
                    variant={rec.implemented ? "outline" : "default"}
                    size="sm"
                    disabled={rec.implemented}
                  >
                    {rec.implemented ? 'Applied' : 'Apply'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automatic Optimizations</CardTitle>
              <CardDescription>
                Configure which optimizations should be applied automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="query-opt">Query Optimization</Label>
                  <p className="text-sm text-gray-500">Automatically optimize slow database queries</p>
                </div>
                <Switch
                  id="query-opt"
                  checked={autoOptimizations.queryOptimization}
                  onCheckedChange={(checked) => 
                    setAutoOptimizations(prev => ({ ...prev, queryOptimization: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="cache-mgmt">Cache Management</Label>
                  <p className="text-sm text-gray-500">Intelligent cache invalidation and warming</p>
                </div>
                <Switch
                  id="cache-mgmt"
                  checked={autoOptimizations.cacheManagement}
                  onCheckedChange={(checked) => 
                    setAutoOptimizations(prev => ({ ...prev, cacheManagement: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="conn-pool">Connection Pooling</Label>
                  <p className="text-sm text-gray-500">Dynamic database connection pool sizing</p>
                </div>
                <Switch
                  id="conn-pool"
                  checked={autoOptimizations.connectionPooling}
                  onCheckedChange={(checked) => 
                    setAutoOptimizations(prev => ({ ...prev, connectionPooling: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="compression">Response Compression</Label>
                  <p className="text-sm text-gray-500">Automatic compression for API responses</p>
                </div>
                <Switch
                  id="compression"
                  checked={autoOptimizations.compressionEnabled}
                  onCheckedChange={(checked) => 
                    setAutoOptimizations(prev => ({ ...prev, compressionEnabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="cdn-opt">CDN Optimization</Label>
                  <p className="text-sm text-gray-500">Optimize static asset delivery via CDN</p>
                </div>
                <Switch
                  id="cdn-opt"
                  checked={autoOptimizations.cdnOptimization}
                  onCheckedChange={(checked) => 
                    setAutoOptimizations(prev => ({ ...prev, cdnOptimization: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
