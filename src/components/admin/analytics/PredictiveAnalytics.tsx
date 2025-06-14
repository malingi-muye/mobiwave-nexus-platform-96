
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Brain,
  Target,
  AlertTriangle,
  Calendar,
  Zap,
  BarChart3
} from 'lucide-react';

interface Prediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  change: number;
  confidence: number;
  timeframe: string;
}

interface TrendData {
  period: string;
  actual: number;
  predicted: number;
  upperBound: number;
  lowerBound: number;
}

export function PredictiveAnalytics() {
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [timeHorizon, setTimeHorizon] = useState<string>('30d');

  const predictions: Prediction[] = [
    {
      metric: 'Monthly Revenue',
      currentValue: 45200,
      predictedValue: 52800,
      change: 16.8,
      confidence: 87,
      timeframe: 'Next 30 days'
    },
    {
      metric: 'Active Users',
      currentValue: 1250,
      predictedValue: 1420,
      change: 13.6,
      confidence: 92,
      timeframe: 'Next 30 days'
    },
    {
      metric: 'Message Volume',
      currentValue: 125000,
      predictedValue: 142000,
      change: 13.6,
      confidence: 89,
      timeframe: 'Next 30 days'
    },
    {
      metric: 'Churn Rate',
      currentValue: 5.2,
      predictedValue: 4.1,
      change: -21.2,
      confidence: 78,
      timeframe: 'Next 30 days'
    }
  ];

  const trendData: TrendData[] = [
    { period: 'Week 1', actual: 45200, predicted: 46000, upperBound: 48000, lowerBound: 44000 },
    { period: 'Week 2', actual: 47100, predicted: 47800, upperBound: 49800, lowerBound: 45800 },
    { period: 'Week 3', actual: 48900, predicted: 49600, upperBound: 51600, lowerBound: 47600 },
    { period: 'Week 4', actual: 50200, predicted: 51400, upperBound: 53400, lowerBound: 49400 },
    { period: 'Week 5', actual: 0, predicted: 52800, upperBound: 55800, lowerBound: 49800 },
    { period: 'Week 6', actual: 0, predicted: 54200, upperBound: 57200, lowerBound: 51200 }
  ];

  const userSegmentPredictions = [
    { segment: 'Enterprise', currentUsers: 45, predictedGrowth: 22, potential: 'High' },
    { segment: 'Small Business', currentUsers: 280, predictedGrowth: 15, potential: 'Medium' },
    { segment: 'Startups', currentUsers: 520, predictedGrowth: 35, potential: 'Very High' },
    { segment: 'Individual', currentUsers: 405, predictedGrowth: 8, potential: 'Low' }
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'bg-green-100 text-green-800';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'Very High': return 'bg-green-100 text-green-800';
      case 'High': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-600" />
            Predictive Analytics
          </h3>
          <p className="text-gray-600">AI-powered predictions and trend analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeHorizon} onValueChange={setTimeHorizon}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Next 7 Days</SelectItem>
              <SelectItem value="30d">Next 30 Days</SelectItem>
              <SelectItem value="90d">Next 90 Days</SelectItem>
              <SelectItem value="1y">Next Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="segments">User Segments</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {predictions.map((prediction, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {prediction.metric}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold">
                        {prediction.metric.includes('Rate') 
                          ? `${prediction.predictedValue}%`
                          : prediction.metric.includes('Revenue')
                          ? `$${prediction.predictedValue.toLocaleString()}`
                          : prediction.predictedValue.toLocaleString()
                        }
                      </div>
                      <div className={`text-sm font-medium ${getChangeColor(prediction.change)}`}>
                        {prediction.change >= 0 ? '+' : ''}{prediction.change}% predicted change
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{prediction.timeframe}</span>
                      <Badge className={getConfidenceColor(prediction.confidence)}>
                        {prediction.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Revenue Growth Opportunity</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Based on current trends, implementing premium features could increase revenue by 25% within 60 days.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">User Acquisition</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Startup segment shows 35% growth potential. Consider targeted marketing campaigns.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-900">Churn Prevention</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Proactive engagement campaigns could reduce churn rate from 5.2% to 4.1%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Revenue Prediction Trend
              </CardTitle>
              <CardDescription>
                Actual vs predicted revenue with confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Actual"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicted"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="upperBound" 
                    stroke="#D1D5DB" 
                    strokeWidth={1}
                    name="Upper Bound"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lowerBound" 
                    stroke="#D1D5DB" 
                    strokeWidth={1}
                    name="Lower Bound"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                User Segment Growth Predictions
              </CardTitle>
              <CardDescription>
                Predicted growth rates for different user segments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userSegmentPredictions.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{segment.segment}</h4>
                      <p className="text-sm text-gray-600">
                        Current: {segment.currentUsers} users
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-lg font-bold text-green-600">
                        +{segment.predictedGrowth}%
                      </div>
                      <Badge className={getPotentialColor(segment.potential)}>
                        {segment.potential}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Optimistic Scenario</CardTitle>
                <CardDescription>Best case predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Revenue Growth</span>
                    <span className="font-bold text-green-600">+28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Growth</span>
                    <span className="font-bold text-green-600">+35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Churn Rate</span>
                    <span className="font-bold text-green-600">-35%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Expected Scenario</CardTitle>
                <CardDescription>Most likely predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Revenue Growth</span>
                    <span className="font-bold text-blue-600">+17%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Growth</span>
                    <span className="font-bold text-blue-600">+14%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Churn Rate</span>
                    <span className="font-bold text-blue-600">-21%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Conservative Scenario</CardTitle>
                <CardDescription>Worst case predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Revenue Growth</span>
                    <span className="font-bold text-red-600">+8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Growth</span>
                    <span className="font-bold text-red-600">+5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Churn Rate</span>
                    <span className="font-bold text-red-600">-10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
