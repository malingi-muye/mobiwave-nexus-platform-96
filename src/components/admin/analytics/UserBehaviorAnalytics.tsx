
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MousePointer, 
  Clock, 
  Eye, 
  Navigation,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  HeatMapChart
} from 'recharts';

export function UserBehaviorAnalytics() {
  const [timeframe, setTimeframe] = useState('7d');

  const userFlowData = [
    { step: 'Landing', users: 10000, dropoff: 0 },
    { step: 'Signup', users: 6500, dropoff: 35 },
    { step: 'Onboarding', users: 5200, dropoff: 20 },
    { step: 'First Action', users: 4100, dropoff: 21 },
    { step: 'Active User', users: 3400, dropoff: 17 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3b82f6' },
    { name: 'Mobile', value: 40, color: '#10b981' },
    { name: 'Tablet', value: 15, color: '#f59e0b' }
  ];

  const pageAnalytics = [
    { page: '/dashboard', views: 12500, time: '3m 45s', bounce: 23 },
    { page: '/services', views: 8900, time: '2m 12s', bounce: 45 },
    { page: '/billing', views: 3400, time: '4m 18s', bounce: 12 },
    { page: '/settings', views: 2100, time: '5m 32s', bounce: 8 }
  ];

  const userSegments = [
    { segment: 'Power Users', count: 1240, growth: '+12%', engagement: 89 },
    { segment: 'Regular Users', count: 5680, growth: '+8%', engagement: 67 },
    { segment: 'Occasional Users', count: 3450, growth: '-3%', engagement: 34 },
    { segment: 'New Users', count: 890, growth: '+25%', engagement: 78 }
  ];

  const heatmapData = [
    { hour: '00', monday: 12, tuesday: 15, wednesday: 18, thursday: 22, friday: 28, saturday: 35, sunday: 20 },
    { hour: '06', monday: 45, tuesday: 52, wednesday: 48, thursday: 55, friday: 62, saturday: 28, sunday: 25 },
    { hour: '12', monday: 78, tuesday: 85, wednesday: 92, thursday: 88, friday: 95, saturday: 45, sunday: 38 },
    { hour: '18', monday: 65, tuesday: 72, wednesday: 68, thursday: 75, friday: 82, saturday: 55, sunday: 48 }
  ];

  return (
    <div className="space-y-6">
      {/* User Behavior Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Page Views</span>
            </div>
            <div className="text-2xl font-bold">156.2K</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Avg Session</span>
            </div>
            <div className="text-2xl font-bold">4m 32s</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingDown className="w-3 h-3 text-red-500" />
              <span className="text-red-500">-2.1%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Bounce Rate</span>
            </div>
            <div className="text-2xl font-bold">32.8%</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingDown className="w-3 h-3 text-green-500" />
              <span className="text-green-500">-5.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Conversion</span>
            </div>
            <div className="text-2xl font-bold">3.8%</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+0.5%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="flow" className="w-full">
        <TabsList>
          <TabsTrigger value="flow">User Flow</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="pages">Page Analytics</TabsTrigger>
          <TabsTrigger value="segments">User Segments</TabsTrigger>
          <TabsTrigger value="heatmap">Activity Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Conversion Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="step" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    <span>Desktop</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">4m 15s</div>
                    <div className="text-sm text-gray-500">Avg Session</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Mobile</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">2m 48s</div>
                    <div className="text-sm text-gray-500">Avg Session</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tablet className="w-4 h-4" />
                    <span>Tablet</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">3m 22s</div>
                    <div className="text-sm text-gray-500">Avg Session</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Page</th>
                      <th className="text-right py-2">Page Views</th>
                      <th className="text-right py-2">Avg Time</th>
                      <th className="text-right py-2">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageAnalytics.map((page, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 font-medium">{page.page}</td>
                        <td className="text-right py-3">{page.views.toLocaleString()}</td>
                        <td className="text-right py-3">{page.time}</td>
                        <td className="text-right py-3">
                          <Badge variant={page.bounce < 30 ? 'default' : 'destructive'}>
                            {page.bounce}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userSegments.map((segment, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-medium">{segment.segment}</h3>
                    <div className="text-2xl font-bold">{segment.count.toLocaleString()}</div>
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={segment.growth.startsWith('+') ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {segment.growth}
                      </Badge>
                      <span className="text-sm text-gray-500">Growth</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engagement</span>
                        <span>{segment.engagement}%</span>
                      </div>
                      <Progress value={segment.engagement} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Interactive activity heatmap showing user engagement patterns</p>
                <p className="text-sm">Peak activity: Weekdays 12-2 PM</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
