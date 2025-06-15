
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, GitBranch, Settings, Clock } from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  name: string;
  config: any;
  position: { x: number; y: number };
}

interface WorkflowHeaderProps {
  workflowName: string;
  workflowDescription: string;
  onWorkflowNameChange: (name: string) => void;
  onWorkflowDescriptionChange: (description: string) => void;
  onAddNode: (type: WorkflowNode['type']) => void;
}

export function WorkflowHeader({ 
  workflowName, 
  workflowDescription, 
  onWorkflowNameChange, 
  onWorkflowDescriptionChange, 
  onAddNode 
}: WorkflowHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              value={workflowName}
              onChange={(e) => onWorkflowNameChange(e.target.value)}
              placeholder="Enter workflow name"
            />
          </div>
          <div>
            <Label htmlFor="workflow-description">Description</Label>
            <Input
              id="workflow-description"
              value={workflowDescription}
              onChange={(e) => onWorkflowDescriptionChange(e.target.value)}
              placeholder="Enter workflow description"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onAddNode('trigger')}
            className="flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            Add Trigger
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onAddNode('condition')}
            className="flex items-center gap-1"
          >
            <GitBranch className="w-3 h-3" />
            Add Condition
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onAddNode('action')}
            className="flex items-center gap-1"
          >
            <Settings className="w-3 h-3" />
            Add Action
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onAddNode('delay')}
            className="flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            Add Delay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
