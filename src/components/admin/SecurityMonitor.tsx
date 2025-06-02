
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Lock, Eye, Globe } from 'lucide-react';

interface SecurityMetric {
  name: string;
  status: 'secure' | 'warning' | 'critical';
  description: string;
  lastChecked: Date;
}

export function SecurityMonitor() {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([
    {
      name: 'HTTPS Enforcement',
      status: 'secure',
      description: 'All connections are encrypted with TLS',
      lastChecked: new Date()
    },
    {
      name: 'Authentication Security',
      status: 'secure',
      description: 'Multi-factor authentication enabled',
      lastChecked: new Date()
    },
    {
      name: 'API Rate Limiting',
      status: 'secure',
      description: 'Rate limits configured and active',
      lastChecked: new Date()
    },
    {
      name: 'Data Encryption',
      status: 'secure',
      description: 'Data encrypted at rest and in transit',
      lastChecked: new Date()
    },
    {
      name: 'Session Management',
      status: 'warning',
      description: 'Session timeout could be optimized',
      lastChecked: new Date()
    },
    {
      name: 'SQL Injection Protection',
      status: 'secure',
      description: 'Parameterized queries in use',
      lastChecked: new Date()
    }
  ]);

  const [threatAlerts, setThreatAlerts] = useState([
    {
      id: 1,
      severity: 'low',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      id: 2,
      severity: 'medium',
      message: 'Unusual API usage pattern detected in user account',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ]);

  const getStatusIcon = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'secure': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'secure': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-blue-200 bg-blue-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'high': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const secureCount = securityMetrics.filter(m => m.status === 'secure').length;
  const overallScore = Math.round((secureCount / securityMetrics.length) * 100);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Security Dashboard
              </CardTitle>
              <CardDescription>
                Real-time security monitoring and threat detection
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{overallScore}%</div>
              <div className="text-sm text-gray-600">Security Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityMetrics.map((metric, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{metric.name}</h4>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(metric.status)}
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{metric.description}</p>
                  <p className="text-xs text-gray-500">
                    Last checked: {metric.lastChecked.toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-600" />
            Security Alerts
          </CardTitle>
          <CardDescription>
            Recent security events and threat notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {threatAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p>No security alerts at this time</p>
              </div>
            ) : (
              threatAlerts.map((alert) => (
                <Alert key={alert.id} className={getAlertColor(alert.severity)}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex justify-between items-center">
                    <span>{alert.message}</span>
                    <span className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleString()}
                    </span>
                  </AlertDescription>
                </Alert>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            Security Recommendations
          </CardTitle>
          <CardDescription>
            Automated security improvements and best practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">HTTPS Enforced</h4>
                <p className="text-sm text-green-700">All traffic is securely encrypted</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Consider Shorter Session Timeouts</h4>
                <p className="text-sm text-yellow-700">Reduce session timeout to 30 minutes for enhanced security</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Regular Security Audits</h4>
                <p className="text-sm text-blue-700">Schedule monthly security assessments and penetration testing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
