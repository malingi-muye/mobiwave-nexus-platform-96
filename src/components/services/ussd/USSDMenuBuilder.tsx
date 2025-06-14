
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Settings, Menu, AlertCircle, CheckCircle } from 'lucide-react';

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

  const validateMenuStructure = () => {
    const issues = [];
    
    // Check if there's a root node
    const hasRoot = menuStructure.some(node => node.id === 'root');
    if (!hasRoot && menuStructure.length > 0) {
      issues.push('No root menu found. Consider setting the first menu as root.');
    }
    
    // Check for empty menus
    const emptyMenus = menuStructure.filter(node => !node.text.trim());
    if (emptyMenus.length > 0) {
      issues.push(`${emptyMenus.length} menu(s) have empty text.`);
    }
    
    // Check for menus with no options (and not end nodes)
    const menusWithoutOptions = menuStructure.filter(node => !node.isEndNode && node.options.length === 0);
    if (menusWithoutOptions.length > 0) {
      issues.push(`${menusWithoutOptions.length} menu(s) have no options but are not end nodes.`);
    }
    
    return issues;
  };

  const addMenuNode = () => {
    const newNode: MenuNode = {
      id: `node-${Date.now()}`,
      text: 'Enter menu text here',
      options: ['Option 1'],
      isEndNode: false
    };
    
    const updatedMenu = [...menuStructure, newNode];
    onUpdateMenu(updatedMenu);
    setEditingNode(newNode.id);
  };

  const updateMenuNode = (nodeId: string, updates: Partial<MenuNode>) => {
    const updatedMenu = menuStructure.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    );
    onUpdateMenu(updatedMenu);
  };

  const deleteMenuNode = (nodeId: string) => {
    if (menuStructure.length <= 1) return; // Don't delete the last menu
    
    const updatedMenu = menuStructure.filter(node => node.id !== nodeId);
    onUpdateMenu(updatedMenu);
    
    if (editingNode === nodeId) {
      setEditingNode(null);
    }
  };

  const addOption = (nodeId: string) => {
    const node = menuStructure.find(n => n.id === nodeId);
    if (node && node.options.length < 9) { // USSD typically supports 1-9 options
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

  const setAsRootNode = (nodeId: string) => {
    const updatedMenu = menuStructure.map(node => ({
      ...node,
      id: node.id === nodeId ? 'root' : (node.id === 'root' ? `node-${Date.now()}` : node.id)
    }));
    onUpdateMenu(updatedMenu);
  };

  const validationIssues = validateMenuStructure();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Menu className="w-5 h-5" />
            USSD Menu Structure
          </span>
          <div className="flex items-center gap-2">
            {validationIssues.length > 0 ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationIssues.length} Issues
              </Badge>
            ) : (
              <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3" />
                Valid
              </Badge>
            )}
            <Button onClick={addMenuNode} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Menu
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {validationIssues.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800 mb-2">Menu Validation Issues:</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {validationIssues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {menuStructure.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Menu className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="mb-4">No menu nodes created yet.</p>
            <Button onClick={addMenuNode}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Menu
            </Button>
          </div>
        ) : (
          menuStructure.map((node, index) => (
            <Card key={node.id} className={`border-l-4 ${node.id === 'root' ? 'border-l-blue-500' : 'border-l-gray-300'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">
                      {node.id === 'root' ? 'Root Menu' : `Menu ${index + 1}`}
                    </Badge>
                    <Badge variant={node.isEndNode ? 'destructive' : 'default'}>
                      {node.isEndNode ? 'End Node' : 'Menu Node'}
                    </Badge>
                    {!node.text.trim() && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Empty Text
                      </Badge>
                    )}
                    {!node.isEndNode && node.options.length === 0 && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        No Options
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {node.id !== 'root' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAsRootNode(node.id)}
                        title="Set as root menu"
                      >
                        Root
                      </Button>
                    )}
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
                      disabled={menuStructure.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`text-${node.id}`}>Menu Text *</Label>
                  <Textarea
                    id={`text-${node.id}`}
                    value={node.text}
                    onChange={(e) => updateMenuNode(node.id, { text: e.target.value })}
                    placeholder="Enter the text that will be displayed to users (e.g., Welcome to our service. Please select an option:)"
                    rows={3}
                    className={!node.text.trim() ? 'border-orange-300 focus:border-orange-500' : ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Characters: {node.text.length}/160 (USSD messages are typically under 160 characters)
                  </p>
                </div>

                {!node.isEndNode && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Menu Options *</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addOption(node.id)}
                        disabled={node.options.length >= 9}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Option ({node.options.length}/9)
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {node.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2">
                          <div className="w-8 h-9 bg-gray-100 rounded flex items-center justify-center text-sm font-medium">
                            {optionIndex + 1}
                          </div>
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
                      {node.options.length === 0 && (
                        <p className="text-sm text-orange-600">
                          This menu has no options. Add at least one option or mark it as an end node.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {editingNode === node.id && (
                  <div className="border-t pt-4">
                    <div className="space-y-3">
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
                      {node.isEndNode && (
                        <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                          End nodes terminate the USSD session. Users will see this message and the session will end.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}

        {menuStructure.length > 0 && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <strong>Tips:</strong>
            <ul className="mt-1 space-y-1">
              <li>• The root menu is the first menu users will see when they dial your USSD code</li>
              <li>• Keep menu text under 160 characters for better compatibility</li>
              <li>• USSD supports up to 9 options per menu (numbered 1-9)</li>
              <li>• End nodes terminate the session - use them for final messages or confirmations</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
