
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Crown } from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface Service {
  id: string;
  name: string;
  is_active: boolean;
  is_premium: boolean;
}

interface UserServiceGridProps {
  users: User[];
  services: Service[];
  isServiceEnabledForUser: (userId: string, serviceId: string) => boolean;
  onToggleUserService: (userId: string, serviceId: string, enabled: boolean) => void;
  onEnableAllServices: (userId: string) => void;
  isEnablingAll: boolean;
}

export function UserServiceGrid({
  users,
  services,
  isServiceEnabledForUser,
  onToggleUserService,
  onEnableAllServices,
  isEnablingAll
}: UserServiceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-sm">
                  {user.first_name || user.last_name 
                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                    : user.email.split('@')[0]
                  }
                </CardTitle>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {services.map((service) => {
                const isEnabled = isServiceEnabledForUser(user.id, service.id);
                return (
                  <div key={service.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isEnabled ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {service.name}
                        {service.is_premium && <Crown className="w-3 h-3 ml-1" />}
                      </Badge>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => 
                        onToggleUserService(user.id, service.id, checked)
                      }
                      disabled={!service.is_active}
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
            <Button
              size="sm"
              onClick={() => onEnableAllServices(user.id)}
              disabled={isEnablingAll}
              className="w-full"
            >
              Enable All Services
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
