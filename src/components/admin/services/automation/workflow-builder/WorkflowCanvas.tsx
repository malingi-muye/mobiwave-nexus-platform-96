
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Move, Trash2, Settings, Clock, Zap, GitBranch } from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  name: string;
  config: any;
  position: { x: number; y: number };
}

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  onRemoveNode: (nodeId: string) => void;
}

export function WorkflowCanvas({ nodes, onRemoveNode }: WorkflowCanvasProps) {
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
                          onClick={() => onRemoveNode(node.id)}
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
  );
}
