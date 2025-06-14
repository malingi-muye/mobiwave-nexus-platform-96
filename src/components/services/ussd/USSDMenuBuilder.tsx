
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Settings, Menu } from 'lucide-react';

interface MenuNode {
  id: string;
  text: string;
  options: string[];
  isEndNode: boolean;
}

interface USSDMenuBuilderProps {
  menuStructure: MenuNode[];
  onUpdateMenu: (menu: MenuNode[]) => void;
}

export function USSDMenuBuilder({ menuStructure, onUpdateMenu }: USSDMenuBuilderProps) {
  const [editingNode, setEditingNode] = useState<string | null>(null);

  const addMenuNode = () => {
    const newNode: MenuNode = {
      id: `node-${Date.now()}`,
      text: 'Enter menu text here',
      options: ['Option 1'],
      isEndNode: false
    };
    
    const updatedMenu = [...menuStructure, newNode];
    onUpdateMenu(updatedMenu);
  };

  const updateMenuNode = (nodeId: string, updates: Partial<MenuNode>) => {
    const updatedMenu = menuStructure.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    );
    onUpdateMenu(updatedMenu);
  };

  const deleteMenuNode = (nodeId: string) => {
    const updatedMenu = menuStructure.filter(node => node.id !== nodeId);
    onUpdateMenu(updatedMenu);
  };

  const addOption = (nodeId: string) => {
    const node = menuStructure.find(n => n.id === nodeId);
    if (node) {
      const newOptions = [...node.options, `Option ${node.options.length + 1}`];
      updateMenuNode(nodeId, { options: newOptions });
    }
  };

  const updateOption = (nodeId: string, optionIndex: number, value: string) => {
    const node = menuStructure.find(n => n.id === nodeId);
    if (node) {
      const newOptions = [...node.options];
      newOptions[optionIndex] = value;
      updateMenuNode(nodeId, { options: newOptions });
    }
  };

  const removeOption = (nodeId: string, optionIndex: number) => {
    const node = menuStructure.find(n => n.id === nodeId);
    if (node && node.options.length > 1) {
      const newOptions = node.options.filter((_, index) => index !== optionIndex);
      updateMenuNode(nodeId, { options: newOptions });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Menu className="w-5 h-5" />
            USSD Menu Structure
          </span>
          <Button onClick={addMenuNode} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Menu
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {menuStructure.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Menu className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No menu nodes created yet. Click "Add Menu" to start building your USSD menu.</p>
          </div>
        ) : (
          menuStructure.map((node, index) => (
            <Card key={node.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Menu {index + 1}</Badge>
                    <Badge variant={node.isEndNode ? 'destructive' : 'default'}>
                      {node.isEndNode ? 'End Node' : 'Menu Node'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingNode(editingNode === node.id ? null : node.id)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMenuNode(node.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`text-${node.id}`}>Menu Text</Label>
                  <Textarea
                    id={`text-${node.id}`}
                    value={node.text}
                    onChange={(e) => updateMenuNode(node.id, { text: e.target.value })}
                    placeholder="Enter the text that will be displayed to users"
                    rows={3}
                  />
                </div>

                {!node.isEndNode && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Menu Options</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addOption(node.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Option
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {node.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(node.id, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          {node.options.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeOption(node.id, optionIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {editingNode === node.id && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={node.isEndNode}
                          onChange={(e) => updateMenuNode(node.id, { isEndNode: e.target.checked })}
                        />
                        <span className="text-sm">End Node (terminates session)</span>
                      </label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
