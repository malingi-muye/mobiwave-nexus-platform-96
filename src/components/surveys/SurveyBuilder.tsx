
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react';
import { useSurveys } from '@/hooks/useSurveys';
import { toast } from 'sonner';

interface Question {
  id: string;
  type: 'text' | 'choice' | 'rating' | 'yes_no';
  text: string;
  options?: string[];
  required: boolean;
}

interface SurveyBuilderProps {
  onBack: () => void;
}

export function SurveyBuilder({ onBack }: SurveyBuilderProps) {
  const [surveyData, setSurveyData] = useState({
    title: '',
    description: '',
    questions: [] as Question[]
  });
  
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'text',
    text: '',
    required: false
  });

  const { createSurvey, publishSurvey, isCreating } = useSurveys();

  const addQuestion = () => {
    if (!newQuestion.text) {
      toast.error('Please enter a question');
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      type: newQuestion.type as Question['type'],
      text: newQuestion.text,
      options: newQuestion.options || [],
      required: newQuestion.required || false
    };

    setSurveyData(prev => ({
      ...prev,
      questions: [...prev.questions, question]
    }));

    setNewQuestion({ type: 'text', text: '', required: false });
  };

  const removeQuestion = (questionId: string) => {
    setSurveyData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const saveDraft = async () => {
    if (!surveyData.title) {
      toast.error('Please enter a survey title');
      return;
    }

    try {
      await createSurvey({
        title: surveyData.title,
        description: surveyData.description,
        question_flow: surveyData.questions,
        status: 'draft',
        target_audience: {},
        distribution_channels: []
      });
      onBack();
    } catch (error) {
      console.error('Failed to save survey:', error);
    }
  };

  const publishSurveyDirect = async () => {
    if (!surveyData.title || surveyData.questions.length === 0) {
      toast.error('Please add a title and at least one question');
      return;
    }

    try {
      const survey = await createSurvey({
        title: surveyData.title,
        description: surveyData.description,
        question_flow: surveyData.questions,
        status: 'active',
        target_audience: {},
        distribution_channels: ['sms']
      });
      
      toast.success('Survey published successfully');
      onBack();
    } catch (error) {
      console.error('Failed to publish survey:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Survey Builder</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Survey Details</CardTitle>
            <CardDescription>Configure your survey settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Survey Title</Label>
              <Input
                id="title"
                value={surveyData.title}
                onChange={(e) => setSurveyData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter survey title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={surveyData.description}
                onChange={(e) => setSurveyData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your survey"
                rows={3}
              />
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Add Question</h3>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select 
                    value={newQuestion.type} 
                    onValueChange={(value) => setNewQuestion(prev => ({ ...prev, type: value as Question['type'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Response</SelectItem>
                      <SelectItem value="choice">Multiple Choice</SelectItem>
                      <SelectItem value="rating">Rating Scale</SelectItem>
                      <SelectItem value="yes_no">Yes/No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Input
                    value={newQuestion.text || ''}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter your question"
                  />
                </div>
                
                {newQuestion.type === 'choice' && (
                  <div className="space-y-2">
                    <Label>Options (one per line)</Label>
                    <Textarea
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      onChange={(e) => setNewQuestion(prev => ({ 
                        ...prev, 
                        options: e.target.value.split('\n').filter(o => o.trim()) 
                      }))}
                      rows={3}
                    />
                  </div>
                )}
              </div>
              
              <Button onClick={addQuestion} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={saveDraft} variant="outline" disabled={isCreating}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={publishSurveyDirect} disabled={isCreating}>
                <Send className="w-4 h-4 mr-2" />
                Publish Survey
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Preview</CardTitle>
            <CardDescription>Review your survey questions</CardDescription>
          </CardHeader>
          <CardContent>
            {surveyData.questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No questions added yet</p>
            ) : (
              <div className="space-y-4">
                {surveyData.questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">Q{index + 1}. {question.text}</p>
                        <p className="text-sm text-gray-500 capitalize">{question.type.replace('_', ' ')}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {question.options && question.options.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">Options:</p>
                        <ul className="text-sm space-y-1">
                          {question.options.map((option, idx) => (
                            <li key={idx} className="text-gray-700">• {option}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
