
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from 'lucide-react';

interface MenuNode {
  id: string;
  text: string;
  options: { key: string; text: string; nextNodeId?: string }[];
  isEndNode: boolean;
  response?: string;
}

interface USSDMenuBuilderProps {
  menuNodes: MenuNode[];
  setMenuNodes: (nodes: MenuNode[]) => void;
}

export function USSDMenuBuilder({ menuNodes, setMenuNodes }: USSDMenuBuilderProps) {
  const addMenuNode = () => {
    const newNode: MenuNode = {
      id: `node_${Date.now()}`,
      text: 'New menu text',
      options: [{ key: '1', text: 'Option 1', nextNodeId: undefined }],
      isEndNode: false
    };
    setMenuNodes([...menuNodes, newNode]);
  };

  const updateMenuNode = (nodeId: string, updates: Partial<MenuNode>) => {
    setMenuNodes(nodes => 
      nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  };

  const addOption = (nodeId: string) => {
    const node = menuNodes.find(n => n.id === nodeId);
    if (node) {
      const newOptionKey = (node.options.length + 1).toString();
      updateMenuNode(nodeId, {
        options: [...node.options, { key: newOptionKey, text: `Option ${newOptionKey}`, nextNodeId: undefined }]
      });
    }
  };

  const removeOption = (nodeId: string, optionKey: string) => {
    const node = menuNodes.find(n => n.id === nodeId);
    if (node) {
      updateMenuNode(nodeId, {
        options: node.options.filter(opt => opt.key !== optionKey)
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Label>Menu Structure</Label>
        <Button size="sm" onClick={addMenuNode} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Menu
        </Button>
      </div>

      <div className="space-y-4">
        {menuNodes.map((node, index) => (
          <Card key={node.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{node.id === 'root' ? 'Root Menu' : `Menu ${index}`}</Badge>
                  {node.id !== 'root' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setMenuNodes(nodes => nodes.filter(n => n.id !== node.id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div>
                  <Label>Menu Text</Label>
                  <Textarea
                    value={node.text}
                    onChange={(e) => updateMenuNode(node.id, { text: e.target.value })}
                    placeholder="Enter the text users will see"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Options</Label>
                    <Button size="sm" onClick={() => addOption(node.id)} variant="outline">
                      <Plus className="w-3 h-3 mr-1" />
                      Add Option
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {node.options.map((option) => (
                      <div key={option.key} className="flex items-center gap-2 p-2 border rounded">
                        <Input
                          className="w-16"
                          value={option.key}
                          onChange={(e) => {
                            const updatedOptions = node.options.map(opt =>
                              opt.key === option.key ? { ...opt, key: e.target.value } : opt
                            );
                            updateMenuNode(node.id, { options: updatedOptions });
                          }}
                        />
                        <Input
                          className="flex-1"
                          value={option.text}
                          onChange={(e) => {
                            const updatedOptions = node.options.map(opt =>
                              opt.key === option.key ? { ...opt, text: e.target.value } : opt
                            );
                            updateMenuNode(node.id, { options: updatedOptions });
                          }}
                          placeholder="Option text"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeOption(node.id, option.key)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
