
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { 
  GitBranch, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Deploy,
  TestTube,
  Package,
  Monitor,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface Pipeline {
  id: string;
  name: string;
  branch: string;
  status: 'running' | 'success' | 'failed' | 'pending';
  progress: number;
  stages: PipelineStage[];
  duration: string;
  triggeredBy: string;
  timestamp: string;
}

interface PipelineStage {
  id: string;
  name: string;
  status: 'running' | 'success' | 'failed' | 'pending' | 'skipped';
  duration?: string;
  logs?: string[];
}

export function DevOpsPipeline() {
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);

  const { data: pipelines, refetch } = useQuery({
    queryKey: ['devops-pipelines'],
    queryFn: async (): Promise<Pipeline[]> => {
      return [
        {
          id: '1',
          name: 'Production Deployment',
          branch: 'main',
          status: 'success',
          progress: 100,
          duration: '4m 32s',
          triggeredBy: 'admin@mobiwave.com',
          timestamp: '2025-06-14T10:30:00Z',
          stages: [
            { id: '1', name: 'Build', status: 'success', duration: '1m 20s' },
            { id: '2', name: 'Test', status: 'success', duration: '2m 15s' },
            { id: '3', name: 'Security Scan', status: 'success', duration: '45s' },
            { id: '4', name: 'Deploy', status: 'success', duration: '12s' }
          ]
        },
        {
          id: '2',
          name: 'Feature Branch CI',
          branch: 'feature/whatsapp-templates',
          status: 'running',
          progress: 65,
          duration: '2m 45s',
          triggeredBy: 'developer@mobiwave.com',
          timestamp: '2025-06-14T10:25:00Z',
          stages: [
            { id: '1', name: 'Build', status: 'success', duration: '1m 10s' },
            { id: '2', name: 'Test', status: 'running' },
            { id: '3', name: 'Security Scan', status: 'pending' },
            { id: '4', name: 'Deploy', status: 'pending' }
          ]
        },
        {
          id: '3',
          name: 'Staging Deployment',
          branch: 'develop',
          status: 'failed',
          progress: 45,
          duration: '3m 20s',
          triggeredBy: 'system',
          timestamp: '2025-06-14T10:15:00Z',
          stages: [
            { id: '1', name: 'Build', status: 'success', duration: '1m 15s' },
            { id: '2', name: 'Test', status: 'failed', duration: '2m 5s' },
            { id: '3', name: 'Security Scan', status: 'skipped' },
            { id: '4', name: 'Deploy', status: 'skipped' }
          ]
        }
      ];
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageIcon = (stageName: string) => {
    switch (stageName.toLowerCase()) {
      case 'build': return <Package className="w-4 h-4" />;
      case 'test': return <TestTube className="w-4 h-4" />;
      case 'security scan': return <AlertTriangle className="w-4 h-4" />;
      case 'deploy': return <Deploy className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-green-900 via-green-800 to-green-700 bg-clip-text text-transparent">
          DevOps Pipeline
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Monitor and manage CI/CD pipelines, deployments, and infrastructure automation for enterprise-grade delivery.
        </p>
      </div>

      <Tabs defaultValue="pipelines" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="pipelines" className="space-y-6">
          {/* Pipeline Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-3xl font-bold text-green-600">94.2%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
                    <p className="text-3xl font-bold text-blue-600">3m 45s</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Pipelines</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {pipelines?.filter(p => p.status === 'running').length || 0}
                    </p>
                  </div>
                  <Play className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Deployments Today</p>
                    <p className="text-3xl font-bold text-purple-600">12</p>
                  </div>
                  <Deploy className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pipeline List */}
          <div className="space-y-4">
            {pipelines?.map((pipeline) => (
              <Card key={pipeline.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GitBranch className="w-5 h-5 text-gray-600" />
                      <div>
                        <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                        <CardDescription>
                          Branch: {pipeline.branch} • Triggered by {pipeline.triggeredBy}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(pipeline.status)}>
                        {getStatusIcon(pipeline.status)}
                        <span className="ml-1">{pipeline.status}</span>
                      </Badge>
                      <span className="text-sm text-gray-600">{pipeline.duration}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={pipeline.progress} className="w-full" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {pipeline.stages.map((stage) => (
                        <div key={stage.id} className="flex items-center gap-2 p-3 border rounded-lg">
                          {getStageIcon(stage.name)}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{stage.name}</p>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(stage.status)}
                              <span className="text-xs text-gray-600">{stage.duration || 'Pending'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-gray-600">
                        {new Date(pipeline.timestamp).toLocaleString()}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Logs</Button>
                        {pipeline.status === 'failed' && (
                          <Button size="sm">Retry</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deployments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment History</CardTitle>
              <CardDescription>
                Track deployment history across environments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Deploy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Deployment Tracking</h3>
                <p className="text-gray-600">
                  Detailed deployment history and rollback capabilities will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Monitoring</CardTitle>
              <CardDescription>
                Real-time monitoring of deployment infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Infrastructure Monitoring</h3>
                <p className="text-gray-600">
                  Real-time infrastructure metrics and alerting will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Configuration</CardTitle>
              <CardDescription>
                Configure CI/CD pipeline settings and deployment strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <GitBranch className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Pipeline Configuration</h3>
                <p className="text-gray-600">
                  Advanced pipeline configuration and deployment strategies will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
