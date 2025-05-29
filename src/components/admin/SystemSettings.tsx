
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Server, Database, Shield, Mail, MessageSquare } from 'lucide-react';

export function SystemSettings() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
          System Settings
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Configure system-wide settings, integrations, and security parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic system configuration and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Application Name</Label>
              <Input id="app-name" defaultValue="Mobiwave Admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-url">Application URL</Label>
              <Input id="app-url" defaultValue="https://admin.mobiwave.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" defaultValue="admin@mobiwave.com" />
            </div>
            <Button className="w-full">Save General Settings</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Authentication and security configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input defaultValue="60" />
            </div>
            <div className="space-y-2">
              <Label>Password Min Length</Label>
              <Input defaultValue="8" />
            </div>
            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Update Security Settings
            </Button>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Database Configuration
            </CardTitle>
            <CardDescription>
              Database connection and performance settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Connection Status</Label>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <div className="space-y-2">
              <Label>Max Connections</Label>
              <Input defaultValue="100" />
            </div>
            <div className="space-y-2">
              <Label>Query Timeout (seconds)</Label>
              <Input defaultValue="30" />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Test Connection
            </Button>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-600" />
              API Configuration
            </CardTitle>
            <CardDescription>
              API endpoints and integration settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Rate Limit (requests/hour)</Label>
              <Input defaultValue="1000" />
            </div>
            <div className="space-y-2">
              <Label>API Version</Label>
              <Input defaultValue="v2.1" />
            </div>
            <div className="space-y-2">
              <Label>CORS Enabled</Label>
              <Badge className="bg-green-100 text-green-800">Yes</Badge>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Update API Settings
            </Button>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-600" />
              Email Configuration
            </CardTitle>
            <CardDescription>
              SMTP and email delivery settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SMTP Host</Label>
              <Input defaultValue="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input defaultValue="587" />
            </div>
            <div className="space-y-2">
              <Label>From Email</Label>
              <Input defaultValue="noreply@mobiwave.com" />
            </div>
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              Test Email Configuration
            </Button>
          </CardContent>
        </Card>

        {/* SMS Settings */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              SMS Configuration
            </CardTitle>
            <CardDescription>
              SMS provider and delivery settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SMS Provider</Label>
              <Input defaultValue="Twilio" />
            </div>
            <div className="space-y-2">
              <Label>Default Sender ID</Label>
              <Input defaultValue="MOBIWAVE" />
            </div>
            <div className="space-y-2">
              <Label>Daily Rate Limit</Label>
              <Input defaultValue="10000" />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Update SMS Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
