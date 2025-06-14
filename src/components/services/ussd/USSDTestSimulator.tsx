
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Phone, ArrowLeft, RotateCcw, Play } from 'lucide-react';

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

interface SessionStep {
  nodeId: string;
  input?: string;
  timestamp: number;
}

export function USSDTestSimulator({ application, onClose }: USSDTestSimulatorProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionStep[]>([]);
  const [userInput, setUserInput] = useState('');
  const [sessionActive, setSessionActive] = useState(false);

  const getCurrentNode = () => {
    if (!currentNodeId) return null;
    return application.menu_structure.find(node => node.id === currentNodeId) || null;
  };

  const getRootNode = () => {
    return application.menu_structure.find(node => node.id === 'root') || application.menu_structure[0];
  };

  const startSession = () => {
    const rootNode = getRootNode();
    if (rootNode) {
      setCurrentNodeId(rootNode.id);
      setSessionHistory([{ nodeId: rootNode.id, timestamp: Date.now() }]);
      setSessionActive(true);
      setUserInput('');
    }
  };

  const handleUserInput = (input: string) => {
    const currentNode = getCurrentNode();
    if (!currentNode || currentNode.isEndNode || !sessionActive) return;

    const optionIndex = parseInt(input) - 1;
    
    if (optionIndex >= 0 && optionIndex < currentNode.options.length) {
      const selectedOption = currentNode.options[optionIndex];
      
      // Add current input to history
      const newStep: SessionStep = {
        nodeId: currentNode.id,
        input: input,
        timestamp: Date.now()
      };
      
      const updatedHistory = [...sessionHistory, newStep];
      setSessionHistory(updatedHistory);
      
      // Simple navigation logic - in a real implementation this would be more sophisticated
      // For now, we'll try to find a node that matches the selected option
      const nextNode = application.menu_structure.find(node => 
        node.id !== currentNode.id && 
        (node.text.toLowerCase().includes(selectedOption.toLowerCase()) ||
         node.id.toLowerCase().includes(selectedOption.toLowerCase().replace(/\s+/g, '_')))
      );
      
      if (nextNode) {
        setCurrentNodeId(nextNode.id);
        setSessionHistory([...updatedHistory, { nodeId: nextNode.id, timestamp: Date.now() }]);
      } else {
        // If no matching node found, create a generic end state
        setSessionActive(false);
      }
    } else {
      // Invalid input - stay on same menu
      const errorStep: SessionStep = {
        nodeId: currentNode.id,
        input: `INVALID:${input}`,
        timestamp: Date.now()
      };
      setSessionHistory([...sessionHistory, errorStep]);
    }
    
    setUserInput('');
  };

  const goBack = () => {
    if (sessionHistory.length > 1) {
      const newHistory = sessionHistory.slice(0, -1);
      const previousStep = newHistory[newHistory.length - 1];
      setSessionHistory(newHistory);
      setCurrentNodeId(previousStep.nodeId);
      setSessionActive(true);
    }
  };

  const resetSession = () => {
    setCurrentNodeId(null);
    setSessionHistory([]);
    setUserInput('');
    setSessionActive(false);
  };

  const renderSessionDisplay = () => {
    if (!sessionActive && sessionHistory.length === 0) {
      return (
        <div className="text-center py-8">
          <Phone className="w-12 h-12 mx-auto mb-4 text-green-400" />
          <p className="text-green-400 mb-4">USSD Session Ready</p>
          <p className="text-sm text-gray-400">Dial {application.service_code} to start</p>
          <Button onClick={startSession} className="mt-4" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Start Session
          </Button>
        </div>
      );
    }

    const currentNode = getCurrentNode();
    
    return (
      <div className="space-y-3">
        {/* Session History */}
        {sessionHistory.map((step, index) => {
          const node = application.menu_structure.find(n => n.id === step.nodeId);
          const isCurrentStep = index === sessionHistory.length - 1 && sessionActive;
          
          return (
            <div key={index} className={`border-b border-green-600 pb-2 ${isCurrentStep ? 'border-yellow-400' : ''}`}>
              <div className="text-white mb-2">{node?.text}</div>
              
              {!node?.isEndNode && (
                <div className="space-y-1 text-sm">
                  {node?.options.map((option, optIndex) => (
                    <div key={optIndex} className="text-green-300">
                      {optIndex + 1}. {option}
                    </div>
                  ))}
                </div>
              )}
              
              {step.input && (
                <div className="mt-2">
                  {step.input.startsWith('INVALID:') ? (
                    <div className="text-red-400">Invalid input: {step.input.replace('INVALID:', '')}</div>
                  ) : (
                    <div className="text-yellow-400">You entered: {step.input}</div>
                  )}
                </div>
              )}
              
              {node?.isEndNode && (
                <div className="text-yellow-400 mt-2 text-sm">Session ended</div>
              )}
            </div>
          );
        })}
        
        {!sessionActive && sessionHistory.length > 0 && (
          <div className="text-yellow-400 text-center py-4">
            Session Terminated
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="fixed inset-4 z-50 bg-white shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          USSD Simulator - {application.service_code}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={sessionActive ? "default" : "outline"}>
            {sessionActive ? "Active Session" : "Session Ended"}
          </Badge>
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
              <div className="text-center text-xs mb-2 text-green-300">
                USSD Session - {application.service_code}
              </div>
              <div className="border border-green-400 p-2 min-h-[200px]">
                {renderSessionDisplay()}
              </div>
            </div>
            
            {/* Input Area */}
            {sessionActive && getCurrentNode() && !getCurrentNode()?.isEndNode && (
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
                    disabled={!userInput.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Send
                  </Button>
                  <Button onClick={goBack} size="sm" variant="outline" disabled={sessionHistory.length <= 1}>
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button onClick={resetSession} size="sm" variant="outline">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            )}

            {!sessionActive && sessionHistory.length > 0 && (
              <div className="text-center">
                <Button onClick={startSession} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start New Session
                </Button>
              </div>
            )}
          </div>

          {/* Menu Structure Viewer */}
          <div className="space-y-4 overflow-y-auto">
            <h3 className="font-semibold">Menu Structure</h3>
            {application.menu_structure.map((node, index) => (
              <Card 
                key={node.id} 
                className={`p-3 transition-colors ${
                  currentNodeId === node.id ? 'border-blue-500 bg-blue-50' : 
                  sessionHistory.some(step => step.nodeId === node.id) ? 'border-green-500 bg-green-50' : ''
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {node.id === 'root' ? 'Root Menu' : `Menu ${index + 1}`}
                    </Badge>
                    <div className="flex gap-1">
                      {currentNodeId === node.id && (
                        <Badge variant="default" className="text-xs bg-blue-500">Current</Badge>
                      )}
                      {sessionHistory.some(step => step.nodeId === node.id) && currentNodeId !== node.id && (
                        <Badge variant="outline" className="text-xs border-green-500 text-green-600">Visited</Badge>
                      )}
                      <Badge variant={node.isEndNode ? 'destructive' : 'default'} className="text-xs">
                        {node.isEndNode ? 'End' : 'Menu'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm">
                    <strong>Text:</strong> {node.text}
                  </div>
                  {!node.isEndNode && (
                    <div className="text-sm">
                      <strong>Options:</strong>
                      <ul className="list-disc list-inside ml-2 text-xs">
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
          <strong>How to test:</strong> Click "Start Session" to begin testing your USSD flow. 
          Enter option numbers (1, 2, etc.) to navigate through the menu. The simulator tracks 
          your session history and highlights visited menus. Use Back to navigate to previous menus.
        </div>
      </CardContent>
    </Card>
  );
}
