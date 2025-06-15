
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Zap, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Plus
} from 'lucide-react';
import { WorkflowBuilder } from './automation/WorkflowBuilder';
import { WorkflowTemplates } from './automation/WorkflowTemplates';
import { AutomationRules } from './automation/AutomationRules';
import { WorkflowExecutor } from './automation/WorkflowExecutor';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  isActive: boolean;
  executionCount: number;
  lastExecuted?: Date;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: Date;
  executionCount: number;
}

interface WorkflowStep {
  id: string;
  type: 'condition' | 'action' | 'delay';
  name: string;
  config: any;
}

export function ServiceAutomationHub() {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Auto-activate SMS for new users',
      description: 'Automatically activate SMS service for newly registered users',
      trigger: 'user_registration',
      actions: ['activate_sms_service', 'send_welcome_message'],
      isActive: true,
      executionCount: 45,
      lastExecuted: new Date('2024-06-14T10:30:00')
    },
    {
      id: '2',
      name: 'Bulk SMS quota warning',
      description: 'Send alert when user SMS credits are below 10',
      trigger: 'low_credits',
      actions: ['send_notification', 'suggest_topup'],
      isActive: true,
      executionCount: 12,
      lastExecuted: new Date('2024-06-14T09:15:00')
    },
    {
      id: '3',
      name: 'Service deactivation on payment failure',
      description: 'Deactivate premium services when payment fails after 3 attempts',
      trigger: 'payment_failure',
      actions: ['deactivate_premium_services', 'send_payment_reminder'],
      isActive: false,
      executionCount: 3
    }
  ]);

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'New User Onboarding',
      description: 'Complete onboarding flow for new users',
      steps: [
        { id: '1', type: 'action', name: 'Create user profile', config: {} },
        { id: '2', type: 'action', name: 'Initialize credits', config: { amount: 10 } },
        { id: '3', type: 'action', name: 'Activate default services', config: {} },
        { id: '4', type: 'action', name: 'Send welcome email', config: {} }
      ],
      isActive: true,
      createdAt: new Date('2024-06-10'),
      executionCount: 28
    }
  ]);

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, isActive: !rule.isActive }
          : rule
      )
    );
  };

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === workflowId 
          ? { ...workflow, isActive: !workflow.isActive }
          : workflow
      )
    );
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-500' : 'bg-gray-400';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="w-4 h-4" /> : <Pause className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Service Automation Hub</h2>
          <p className="text-gray-600">Automate service management and user workflows</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Automation
        </Button>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Automation Rules
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="execution" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Execution Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4">
            {automationRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(rule.isActive)}`} />
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getStatusIcon(rule.isActive)}
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => toggleAutomationRule(rule.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-600">{rule.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>Executions: {rule.executionCount}</span>
                    </div>
                    {rule.lastExecuted && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>Last: {rule.lastExecuted.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Trigger: {rule.trigger}</Badge>
                    {rule.actions.map((action, index) => (
                      <Badge key={index} variant="outline">{action}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.isActive)}`} />
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getStatusIcon(workflow.isActive)}
                        {workflow.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <Switch
                      checked={workflow.isActive}
                      onCheckedChange={() => toggleWorkflow(workflow.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-600">{workflow.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Settings className="w-4 h-4 text-blue-500" />
                      <span>Steps: {workflow.steps.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>Executions: {workflow.executionCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>Created: {workflow.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {workflow.steps.map((step, index) => (
                      <Badge key={step.id} variant="outline">
                        {index + 1}. {step.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <WorkflowTemplates />
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          <WorkflowExecutor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
