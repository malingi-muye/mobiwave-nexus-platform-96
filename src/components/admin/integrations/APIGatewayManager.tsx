
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Route, 
  Shield, 
  Clock, 
  BarChart3,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface APIRoute {
  id: string;
  path: string;
  method: string;
  target: string;
  rateLimit: number;
  authentication: boolean;
  status: 'active' | 'inactive';
  requests: number;
  latency: number;
}

export function APIGatewayManager() {
  const [routes, setRoutes] = useState<APIRoute[]>([
    {
      id: '1',
      path: '/api/v1/sms/send',
      method: 'POST',
      target: 'https://api.mspace.co.ke/sms',
      rateLimit: 1000,
      authentication: true,
      status: 'active',
      requests: 2450,
      latency: 89
    },
    {
      id: '2',
      path: '/api/v1/analytics/data',
      method: 'GET',
      target: 'https://internal-analytics.service',
      rateLimit: 500,
      authentication: true,
      status: 'active',
      requests: 890,
      latency: 156
    },
    {
      id: '3',
      path: '/api/v1/webhooks/mpesa',
      method: 'POST',
      target: 'https://payments.service/callback',
      rateLimit: 2000,
      authentication: false,
      status: 'active',
      requests: 345,
      latency: 234
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newRoute, setNewRoute] = useState({
    path: '',
    method: 'GET',
    target: '',
    rateLimit: 1000,
    authentication: true
  });

  const createRoute = () => {
    const route: APIRoute = {
      id: Date.now().toString(),
      ...newRoute,
      status: 'active',
      requests: 0,
      latency: 0
    };
    setRoutes([...routes, route]);
    setNewRoute({
      path: '',
      method: 'GET',
      target: '',
      rateLimit: 1000,
      authentication: true
    });
    setIsCreating(false);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">API Gateway</h3>
          <p className="text-gray-600">Manage API routes, rate limiting, and authentication</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Route
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New API Route</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Path</Label>
                <Input
                  placeholder="/api/v1/endpoint"
                  value={newRoute.path}
                  onChange={(e) => setNewRoute({...newRoute, path: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Method</Label>
                <Select value={newRoute.method} onValueChange={(value) => setNewRoute({...newRoute, method: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Target URL</Label>
              <Input
                placeholder="https://target-service.com/endpoint"
                value={newRoute.target}
                onChange={(e) => setNewRoute({...newRoute, target: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rate Limit (requests/hour)</Label>
                <Input
                  type="number"
                  value={newRoute.rateLimit}
                  onChange={(e) => setNewRoute({...newRoute, rateLimit: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Authentication Required</Label>
                <Select 
                  value={newRoute.authentication.toString()} 
                  onValueChange={(value) => setNewRoute({...newRoute, authentication: value === 'true'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={createRoute}>Create Route</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Route className="w-4 h-4" />
              Total Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routes.length}</div>
            <p className="text-xs text-gray-600">Active API routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {routes.reduce((acc, route) => acc + route.requests, 0)}
            </div>
            <p className="text-xs text-gray-600">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(routes.reduce((acc, route) => acc + route.latency, 0) / routes.length)}ms
            </div>
            <p className="text-xs text-gray-600">Response time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getMethodColor(route.method)}>
                      {route.method}
                    </Badge>
                    <code className="font-medium">{route.path}</code>
                    {route.authentication && (
                      <Shield className="w-4 h-4 text-green-600" title="Authentication required" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  Target: {route.target}
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>Rate Limit: {route.rateLimit}/hour</span>
                  <span>Requests: {route.requests}</span>
                  <span>Latency: {route.latency}ms</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
