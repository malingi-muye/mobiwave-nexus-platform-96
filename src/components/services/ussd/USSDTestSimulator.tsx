
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Phone, ArrowLeft, RotateCcw } from 'lucide-react';

interface MenuNode {
  id: string;
  text: string;
  options: string[];
  isEndNode: boolean;
}

interface USSDApplication {
  id: string;
  service_code: string;
  menu_structure: MenuNode[];
  callback_url: string;
  status: string;
}

interface USSDTestSimulatorProps {
  application: USSDApplication;
  onClose: () => void;
}

export function USSDTestSimulator({ application, onClose }: USSDTestSimulatorProps) {
  const [currentNodeId, setCurrentNodeId] = useState('root');
  const [sessionHistory, setSessionHistory] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');

  const currentNode = application.menu_structure.find(node => node.id === currentNodeId);

  const handleUserInput = (input: string) => {
    if (!currentNode || currentNode.isEndNode) return;

    const optionIndex = parseInt(input) - 1;
    
    if (optionIndex >= 0 && optionIndex < currentNode.options.length) {
      const selectedOption = currentNode.options[optionIndex];
      const newHistory = [...sessionHistory, `${currentNode.text}\n\nYou selected: ${optionIndex + 1}. ${selectedOption}`];
      setSessionHistory(newHistory);
      
      // In a real implementation, this would navigate to the next menu based on the selection
      // For now, we'll just show that the selection was made
      const nextNode = application.menu_structure.find(node => 
        node.text.toLowerCase().includes(selectedOption.toLowerCase())
      );
      
      if (nextNode) {
        setCurrentNodeId(nextNode.id);
      }
    } else {
      setSessionHistory([...sessionHistory, `Invalid selection: ${input}. Please try again.`]);
    }
    
    setUserInput('');
  };

  const resetSession = () => {
    setCurrentNodeId('root');
    setSessionHistory([]);
    setUserInput('');
  };

  const goBack = () => {
    if (sessionHistory.length > 0) {
      const newHistory = sessionHistory.slice(0, -1);
      setSessionHistory(newHistory);
      setCurrentNodeId('root'); // Simplified - in real implementation would track navigation
    }
  };

  return (
    <Card className="fixed inset-4 z-50 bg-white shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          USSD Simulator - {application.service_code}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Testing Mode</Badge>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-96">
          {/* Phone Simulator */}
          <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-y-auto">
            <div className="bg-black p-3 rounded mb-4">
              <div className="text-center text-xs mb-2">USSD Session</div>
              <div className="border border-green-400 p-2 min-h-[200px]">
                {sessionHistory.map((entry, index) => (
                  <div key={index} className="mb-2 pb-2 border-b border-green-600 last:border-b-0">
                    {entry}
                  </div>
                ))}
                
                {currentNode && (
                  <div className="text-white">
                    <div className="mb-2">{currentNode.text}</div>
                    {!currentNode.isEndNode && (
                      <div className="space-y-1">
                        {currentNode.options.map((option, index) => (
                          <div key={index}>
                            {index + 1}. {option}
                          </div>
                        ))}
                        <div className="mt-2 text-green-400">Enter your choice:</div>
                      </div>
                    )}
                    {currentNode.isEndNode && (
                      <div className="text-yellow-400 mt-2">Session ended.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Input Area */}
            <div className="space-y-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter option number..."
                className="bg-gray-800 border-green-400 text-green-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUserInput(userInput);
                  }
                }}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleUserInput(userInput)} 
                  size="sm"
                  disabled={!userInput || currentNode?.isEndNode}
                >
                  Send
                </Button>
                <Button onClick={goBack} size="sm" variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <Button onClick={resetSession} size="sm" variant="outline">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Menu Structure Viewer */}
          <div className="space-y-4 overflow-y-auto">
            <h3 className="font-semibold">Menu Structure</h3>
            {application.menu_structure.map((node, index) => (
              <Card 
                key={node.id} 
                className={`p-3 ${currentNodeId === node.id ? 'border-blue-500 bg-blue-50' : ''}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Menu {index + 1}</Badge>
                    <Badge variant={node.isEndNode ? 'destructive' : 'default'}>
                      {node.isEndNode ? 'End' : 'Menu'}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <strong>Text:</strong> {node.text}
                  </div>
                  {!node.isEndNode && (
                    <div className="text-sm">
                      <strong>Options:</strong>
                      <ul className="list-disc list-inside ml-2">
                        {node.options.map((option, optIndex) => (
                          <li key={optIndex}>{optIndex + 1}. {option}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <strong>How to test:</strong> Use the simulator on the left to test your USSD flow. 
          Enter option numbers (1, 2, etc.) to navigate through the menu. 
          The current active menu is highlighted on the right.
        </div>
      </CardContent>
    </Card>
  );
}
