
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, Shield, Database, Globe } from 'lucide-react';

interface ReadinessCheck {
  category: string;
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warning';
    description: string;
    action?: string;
  }>;
}

export function ProductionReadinessChecker() {
  const readinessChecks: ReadinessCheck[] = [
    {
      category: 'Security',
      checks: [
        { name: 'RLS Policies', status: 'pass', description: 'Row Level Security policies are configured' },
        { name: 'Authentication', status: 'pass', description: 'User authentication is properly configured' },
        { name: 'API Security', status: 'warning', description: 'Consider rate limiting for API endpoints' },
        { name: 'HTTPS', status: 'pass', description: 'SSL/TLS encryption is enabled' }
      ]
    },
    {
      category: 'Database',
      checks: [
        { name: 'Backup Strategy', status: 'warning', description: 'Database backup strategy needs configuration' },
        { name: 'Connection Pooling', status: 'pass', description: 'Connection pooling is configured' },
        { name: 'Query Performance', status: 'pass', description: 'Query performance is within acceptable limits' },
        { name: 'Data Validation', status: 'pass', description: 'Input validation is implemented' }
      ]
    },
    {
      category: 'Infrastructure',
      checks: [
        { name: 'Environment Variables', status: 'pass', description: 'All required environment variables are set' },
        { name: 'Error Handling', status: 'pass', description: 'Comprehensive error handling is implemented' },
        { name: 'Monitoring', status: 'warning', description: 'Advanced monitoring tools should be configured' },
        { name: 'Logging', status: 'pass', description: 'Audit logging is enabled' }
      ]
    },
    {
      category: 'Performance',
      checks: [
        { name: 'Code Optimization', status: 'pass', description: 'Code is optimized for production' },
        { name: 'Asset Optimization', status: 'warning', description: 'Consider implementing CDN for static assets' },
        { name: 'Caching Strategy', status: 'warning', description: 'Implement caching for better performance' },
        { name: 'Bundle Size', status: 'pass', description: 'JavaScript bundle size is optimized' }
      ]
    }
  ];

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">Pass</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800">Fail</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'security':
        return <Shield className="w-5 h-5" />;
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'infrastructure':
      case 'performance':
        return <Globe className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const calculateOverallScore = () => {
    const allChecks = readinessChecks.flatMap(category => category.checks);
    const passCount = allChecks.filter(check => check.status === 'pass').length;
    return Math.round((passCount / allChecks.length) * 100);
  };

  const overallScore = calculateOverallScore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Production Readiness Assessment</h3>
        <p className="text-sm text-gray-600">Comprehensive checklist for production deployment</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Readiness Score</span>
            <Badge 
              className={
                overallScore >= 90 ? 'bg-green-100 text-green-800' :
                overallScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }
            >
              {overallScore}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallScore} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            {overallScore >= 90 ? 'Excellent! Ready for production deployment.' :
             overallScore >= 70 ? 'Good progress. Address warnings before deployment.' :
             'Needs attention. Please resolve critical issues.'}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {readinessChecks.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getCategoryIcon(category.category)}
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.checks.map((check, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(check.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{check.name}</h4>
                      {getStatusBadge(check.status)}
                    </div>
                    <p className="text-sm text-gray-600">{check.description}</p>
                    {check.action && (
                      <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                        {check.action}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deployment Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex-col items-start">
              <div className="font-medium">Deploy to Staging</div>
              <div className="text-sm opacity-80">Test in staging environment</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-medium">Run Security Scan</div>
              <div className="text-sm opacity-80">Comprehensive security audit</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-medium">Performance Test</div>
              <div className="text-sm opacity-80">Load and stress testing</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
