
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Activity,
  Key,
  Scan,
  Globe,
  Database,
  RefreshCw
} from 'lucide-react';

interface SecurityMetric {
  id: string;
  name: string;
  status: 'secure' | 'warning' | 'critical';
  score: number;
  description: string;
  lastChecked: string;
  recommendations: string[];
}

interface ThreatAlert {
  id: string;
  type: 'intrusion' | 'vulnerability' | 'anomaly' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
}

export function ProductionSecuritySuite() {
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({
    realTimeMonitoring: true,
    threatDetection: true,
    complianceScanning: true,
    accessLogging: true
  });

  const { data: securityMetrics } = useQuery({
    queryKey: ['security-metrics'],
    queryFn: async (): Promise<SecurityMetric[]> => {
      return [
        {
          id: 'network-security',
          name: 'Network Security',
          status: 'secure',
          score: 96,
          description: 'Firewall, DDoS protection, and network monitoring',
          lastChecked: '2025-06-14T10:30:00Z',
          recommendations: []
        },
        {
          id: 'data-encryption',
          name: 'Data Encryption',
          status: 'secure',
          score: 98,
          description: 'End-to-end encryption for data in transit and at rest',
          lastChecked: '2025-06-14T10:25:00Z',
          recommendations: []
        },
        {
          id: 'access-control',
          name: 'Access Control',
          status: 'warning',
          score: 85,
          description: 'User authentication and authorization systems',
          lastChecked: '2025-06-14T10:20:00Z',
          recommendations: ['Enable MFA for all admin accounts', 'Review inactive user permissions']
        },
        {
          id: 'vulnerability-management',
          name: 'Vulnerability Management',
          status: 'secure',
          score: 94,
          description: 'Automated vulnerability scanning and patching',
          lastChecked: '2025-06-14T10:15:00Z',
          recommendations: []
        },
        {
          id: 'compliance',
          name: 'Compliance Monitoring',
          status: 'warning',
          score: 88,
          description: 'GDPR, SOC2, and industry compliance tracking',
          lastChecked: '2025-06-14T10:10:00Z',
          recommendations: ['Update privacy policy', 'Complete SOC2 audit preparation']
        }
      ];
    }
  });

  const { data: threatAlerts } = useQuery({
    queryKey: ['threat-alerts'],
    queryFn: async (): Promise<ThreatAlert[]> => {
      return [
        {
          id: '1',
          type: 'anomaly',
          severity: 'medium',
          title: 'Unusual API Activity Detected',
          description: 'Spike in API requests from unknown IP ranges',
          timestamp: '2025-06-14T10:25:00Z',
          status: 'investigating'
        },
        {
          id: '2',
          type: 'vulnerability',
          severity: 'low',
          title: 'Outdated Dependency Found',
          description: 'Non-critical dependency requires security update',
          timestamp: '2025-06-14T09:45:00Z',
          status: 'active'
        },
        {
          id: '3',
          type: 'compliance',
          severity: 'high',
          title: 'Data Retention Policy Violation',
          description: 'Data older than retention policy detected',
          timestamp: '2025-06-14T08:30:00Z',
          status: 'resolved'
        }
      ];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const overallSecurityScore = securityMetrics ? 
    Math.round(securityMetrics.reduce((acc, metric) => acc + metric.score, 0) / securityMetrics.length) : 0;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-red-900 via-red-800 to-red-700 bg-clip-text text-transparent">
          Production Security Suite
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Enterprise-grade security monitoring, threat detection, and compliance management for production environments.
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Security Score</p>
                <p className="text-3xl font-bold text-green-600">{overallSecurityScore}%</p>
                <p className="text-sm text-green-600 mt-1">Excellent security</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Threats</p>
                <p className="text-3xl font-bold text-orange-600">
                  {threatAlerts?.filter(alert => alert.status === 'active').length || 0}
                </p>
                <p className="text-sm text-orange-600 mt-1">Monitoring</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Vulnerabilities</p>
                <p className="text-3xl font-bold text-blue-600">2</p>
                <p className="text-sm text-blue-600 mt-1">Low severity</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Scan className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Compliance</p>
                <p className="text-3xl font-bold text-purple-600">92%</p>
                <p className="text-sm text-purple-600 mt-1">GDPR, SOC2</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threat Detection</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityMetrics?.map((metric) => (
              <Card key={metric.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    <Badge className={getStatusColor(metric.status)}>
                      {getStatusIcon(metric.status)}
                      <span className="ml-1">{metric.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Security Score</span>
                        <span className="font-medium">{metric.score}%</span>
                      </div>
                      <Progress value={metric.score} className="w-full" />
                    </div>
                    
                    {metric.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Recommendations:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {metric.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-yellow-600">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      Last checked: {new Date(metric.lastChecked).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Active Threat Alerts
              </CardTitle>
              <CardDescription>
                Real-time threat detection and security incident monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatAlerts?.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{alert.title}</h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge variant={alert.status === 'resolved' ? 'default' : 'secondary'}>
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {alert.status !== 'resolved' && (
                        <>
                          <Button variant="outline" size="sm">Investigate</Button>
                          <Button size="sm">Resolve</Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-blue-600" />
                Vulnerability Assessment
              </CardTitle>
              <CardDescription>
                Automated vulnerability scanning and patch management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Scan className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Vulnerability Scanner</h3>
                <p className="text-gray-600 mb-4">
                  Automated vulnerability scanning results and patch recommendations.
                </p>
                <Button>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run Security Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                Compliance Monitoring
              </CardTitle>
              <CardDescription>
                GDPR, SOC2, and industry compliance tracking and reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">GDPR Compliance</h3>
                    <Progress value={95} className="mb-2" />
                    <p className="text-sm text-gray-600">95% compliant</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">SOC2 Type II</h3>
                    <Progress value={88} className="mb-2" />
                    <p className="text-sm text-gray-600">88% compliant</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">ISO 27001</h3>
                    <Progress value={92} className="mb-2" />
                    <p className="text-sm text-gray-600">92% compliant</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-600" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security monitoring and protection features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(enabledFeatures).map(([feature, enabled]) => (
                <div key={feature} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature === 'realTimeMonitoring' && 'Monitor security events in real-time'}
                      {feature === 'threatDetection' && 'Automated threat detection and response'}
                      {feature === 'complianceScanning' && 'Regular compliance audits and reports'}
                      {feature === 'accessLogging' && 'Log all access attempts and activities'}
                    </p>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(checked) => 
                      setEnabledFeatures(prev => ({ ...prev, [feature]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
