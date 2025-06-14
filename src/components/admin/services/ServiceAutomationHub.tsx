
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  status: 'active' | 'paused' | 'draft';
  lastRun?: string;
  successRate: number;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  steps: { id: string; name: string; status: 'pending' | 'running' | 'completed' | 'failed' }[];
  progress: number;
  status: 'running' | 'completed' | 'failed' | 'paused';
}

export function ServiceAutomationHub() {
  const [activeTab, setActiveTab] = useState('rules');
  
  const automationRules: AutomationRule[] = [
    {
      id: '1',
      name: 'Auto-activate new subscriptions',
      description: 'Automatically activate services when payment is confirmed',
      trigger: 'Payment Confirmed',
      actions: ['Activate Service', 'Send Welcome SMS', 'Create User Account'],
      status: 'active',
      lastRun: '2 hours ago',
      successRate: 98
    },
    {
      id: '2',
      name: 'Low balance notifications',
      description: 'Send notifications when user balance falls below threshold',
      trigger: 'Balance < 100 KES',
      actions: ['Send SMS Alert', 'Send Email', 'Create Support Ticket'],
      status: 'active',
      lastRun: '15 minutes ago',
      successRate: 95
    },
    {
      id: '3',
      name: 'Service expiry reminders',
      description: 'Remind users before service expiration',
      trigger: '7 days before expiry',
      actions: ['Send Reminder SMS', 'Send Email', 'Push Notification'],
      status: 'paused',
      lastRun: '1 day ago',
      successRate: 92
    }
  ];

  const workflows: AutomationWorkflow[] = [
    {
      id: '1',
      name: 'USSD Service Setup',
      description: 'Complete USSD service configuration and deployment',
      steps: [
        { id: '1', name: 'Validate Configuration', status: 'completed' },
        { id: '2', name: 'Create Service Code', status: 'completed' },
        { id: '3', name: 'Deploy to Network', status: 'running' },
        { id: '4', name: 'Test Integration', status: 'pending' },
        { id: '5', name: 'Activate Service', status: 'pending' }
      ],
      progress: 60,
      status: 'running'
    },
    {
      id: '2',
      name: 'M-Pesa Integration',
      description: 'Setup M-Pesa payment integration',
      steps: [
        { id: '1', name: 'API Configuration', status: 'completed' },
        { id: '2', name: 'Security Setup', status: 'completed' },
        { id: '3', name: 'Test Transactions', status: 'completed' },
        { id: '4', name: 'Go Live', status: 'completed' }
      ],
      progress: 100,
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'running': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Service Automation Hub</h3>
          <p className="text-gray-600">Automate service management and workflows</p>
        </div>
        <Button className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Create New Rule
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Automation Rules
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Active Workflows
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {automationRules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{rule.name}</h4>
                      <Badge className={getStatusColor(rule.status)}>
                        {rule.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {rule.status === 'active' ? (
                        <Button size="sm" variant="outline">
                          <Pause className="w-3 h-3" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Play className="w-3 h-3" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{rule.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Trigger</h5>
                      <Badge variant="outline">{rule.trigger}</Badge>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">Actions</h5>
                      <div className="flex flex-wrap gap-1">
                        {rule.actions.map((action, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">Performance</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Success Rate:</span>
                        <span className="font-medium">{rule.successRate}%</span>
                      </div>
                      {rule.lastRun && (
                        <div className="text-xs text-gray-500">Last run: {rule.lastRun}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <p className="text-gray-600">{workflow.description}</p>
                    </div>
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{workflow.progress}%</span>
                    </div>
                    <Progress value={workflow.progress} className="h-2" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workflow.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-3">
                        {getStepIcon(step.status)}
                        <span className={`flex-1 ${
                          step.status === 'completed' ? 'text-green-700' : 
                          step.status === 'running' ? 'text-blue-700' :
                          step.status === 'failed' ? 'text-red-700' : 'text-gray-600'
                        }`}>
                          {step.name}
                        </span>
                        {step.status === 'running' && (
                          <Badge variant="outline" className="text-xs">
                            In Progress
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {workflow.status === 'failed' && (
                    <div className="mt-4 pt-4 border-t">
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <RotateCcw className="w-3 h-3" />
                        Retry Workflow
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
