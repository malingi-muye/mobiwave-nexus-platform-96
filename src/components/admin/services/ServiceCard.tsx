
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Crown, Settings } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  route: string;
  is_active: boolean;
  is_premium: boolean;
}

interface ServiceCardProps {
  service: Service;
  onToggle: (serviceId: string, isActive: boolean) => void;
}

export function ServiceCard({ service, onToggle }: ServiceCardProps) {
  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-blue-600" />
            </div>
            <CardTitle className="text-lg">{service.name}</CardTitle>
            {service.is_premium && <Crown className="w-4 h-4 text-yellow-600" />}
          </div>
          <Switch
            checked={service.is_active}
            onCheckedChange={(checked) => onToggle(service.id, checked)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{service.description}</p>
        <div className="flex items-center justify-between">
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {service.route}
          </code>
          <div className="flex gap-2">
            <Badge variant={service.is_premium ? "default" : "secondary"} className="text-xs">
              {service.is_premium ? 'Premium' : 'Standard'}
            </Badge>
            <Badge variant={service.is_active ? "default" : "destructive"} className="text-xs">
              {service.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
