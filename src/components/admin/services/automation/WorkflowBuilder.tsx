
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Move, 
  Settings,
  Clock,
  Zap,
  GitBranch
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  name: string;
  config: any;
  position: { x: number; y: number };
}

export function WorkflowBuilder() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: '1',
      type: 'trigger',
      name: 'User Registration',
      config: { event: 'user_created' },
      position: { x: 100, y: 100 }
    }
  ]);

  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  const addNode = (type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type,
      name: `New ${type}`,
      config: {},
      position: { x: 200, y: 200 }
    };
    setNodes(prev => [...prev, newNode]);
  };

  const removeNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
  };

  const getNodeIcon = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'trigger':
        return <Zap className="w-4 h-4" />;
      case 'condition':
        return <GitBranch className="w-4 h-4" />;
      case 'action':
        return <Settings className="w-4 h-4" />;
      case 'delay':
        return <Clock className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getNodeColor = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'trigger':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'condition':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'action':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'delay':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
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
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter workflow name"
              />
            </div>
            <div>
              <Label htmlFor="workflow-description">Description</Label>
              <Input
                id="workflow-description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Enter workflow description"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => addNode('trigger')}
              className="flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              Add Trigger
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => addNode('condition')}
              className="flex items-center gap-1"
            >
              <GitBranch className="w-3 h-3" />
              Add Condition
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => addNode('action')}
              className="flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              Add Action
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => addNode('delay')}
              className="flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              Add Delay
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move className="w-5 h-5" />
            Workflow Canvas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-96 border-2 border-dashed border-gray-200 rounded-lg p-4 relative">
            {nodes.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Add nodes to start building your workflow</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {nodes.map((node, index) => (
                  <div key={node.id} className="flex items-center gap-2">
                    {index > 0 && (
                      <div className="w-8 h-0.5 bg-gray-300 ml-6" />
                    )}
                    <Card className={`flex-1 ${getNodeColor(node.type)}`}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getNodeIcon(node.type)}
                            <span className="font-medium">{node.name}</span>
                            <Badge variant="secondary">{node.type}</Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeNode(node.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Save as Template</Button>
        <Button>Save Workflow</Button>
      </div>
    </div>
  );
}
