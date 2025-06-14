
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceCatalog {
  id: string;
  service_name: string;
  service_type: string;
  description: string;
  setup_fee: number;
  monthly_fee: number;
  transaction_fee_type: string;
  transaction_fee_amount: number;
  is_premium: boolean;
  is_active: boolean;
  provider: string;
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  required: boolean;
}

interface ServiceSetupWorkflowProps {
  services: ServiceCatalog[];
  activeWorkflow: string | null;
  onWorkflowComplete: () => void;
}

export function ServiceSetupWorkflow({
  services,
  activeWorkflow,
  onWorkflowComplete
}: ServiceSetupWorkflowProps) {
  const [selectedService, setSelectedService] = useState<ServiceCatalog | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const initializeWorkflow = (service: ServiceCatalog) => {
    const baseSteps: WorkflowStep[] = [
      {
        id: 'prerequisite_check',
        title: 'Prerequisite Check',
        description: 'Verify all requirements are met',
        status: 'pending',
        required: true
      },
      {
        id: 'configuration',
        title: 'Service Configuration',
        description: 'Configure service-specific settings',
        status: 'pending',
        required: true
      },
      {
        id: 'validation',
        title: 'Configuration Validation',
        description: 'Validate configuration settings',
        status: 'pending',
        required: true
      },
      {
        id: 'provisioning',
        title: 'Service Provisioning',
        description: 'Provision service with provider',
        status: 'pending',
        required: true
      },
      {
        id: 'testing',
        title: 'Integration Testing',
        description: 'Test service integration',
        status: 'pending',
        required: false
      },
      {
        id: 'activation',
        title: 'Service Activation',
        description: 'Activate service for users',
        status: 'pending',
        required: true
      }
    ];

    // Add service-specific steps
    if (service.service_type === 'ussd') {
      baseSteps.splice(2, 0, {
        id: 'menu_setup',
        title: 'USSD Menu Setup',
        description: 'Configure USSD menu structure',
        status: 'pending',
        required: true
      });
    } else if (service.service_type === 'mpesa') {
      baseSteps.splice(2, 0, {
        id: 'mpesa_setup',
        title: 'M-Pesa Integration Setup',
        description: 'Configure M-Pesa integration parameters',
        status: 'pending',
        required: true
      });
    }

    setWorkflowSteps(baseSteps);
    setCurrentStep(0);
    setSelectedService(service);
  };

  const executeStep = async (stepIndex: number) => {
    const step = workflowSteps[stepIndex];
    
    // Update step to in_progress
    setWorkflowSteps(prev => prev.map((s, i) => 
      i === stepIndex ? { ...s, status: 'in_progress' } : s
    ));

    try {
      // Simulate step execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark step as completed
      setWorkflowSteps(prev => prev.map((s, i) => 
        i === stepIndex ? { ...s, status: 'completed' } : s
      ));

      toast.success(`${step.title} completed successfully`);

      // Move to next step
      if (stepIndex < workflowSteps.length - 1) {
        setCurrentStep(stepIndex + 1);
      } else {
        // Workflow complete
        toast.success('Service setup workflow completed successfully');
        onWorkflowComplete();
      }
    } catch (error) {
      // Mark step as failed
      setWorkflowSteps(prev => prev.map((s, i) => 
        i === stepIndex ? { ...s, status: 'failed' } : s
      ));
      toast.error(`${step.title} failed`);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const completedSteps = workflowSteps.filter(s => s.status === 'completed').length;
  const progress = workflowSteps.length > 0 ? (completedSteps / workflowSteps.length) * 100 : 0;

  if (!activeWorkflow) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No Active Workflow</h3>
          <p className="text-gray-600 mb-4">
            Start a setup workflow to configure and provision services.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.slice(0, 6).map((service) => (
              <Card key={service.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4" onClick={() => initializeWorkflow(service)}>
                  <h4 className="font-medium mb-2">{service.service_name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <Badge variant="outline">{service.service_type.toUpperCase()}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {selectedService && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Setup Workflow: {selectedService.service_name}</span>
              <Badge variant="outline">{selectedService.service_type.toUpperCase()}</Badge>
            </CardTitle>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress: {completedSteps} of {workflowSteps.length} steps</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    index === currentStep ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{step.title}</h4>
                      {step.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {index === currentStep && step.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => executeStep(index)}
                    >
                      Execute
                    </Button>
                  )}
                  {step.status === 'failed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => executeStep(index)}
                    >
                      Retry
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onWorkflowComplete}>
                Cancel Workflow
              </Button>
              {progress === 100 && (
                <Button onClick={onWorkflowComplete}>
                  Complete Setup
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
