
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Crown } from 'lucide-react';

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

interface UserServiceRowProps {
  user: User;
  services: Service[];
  isServiceEnabledForUser: (userId: string, serviceId: string) => boolean;
  onToggleUserService: (userId: string, serviceId: string, enabled: boolean) => void;
  onEnableAllServices: (userId: string) => void;
  isEnablingAll: boolean;
}

export function UserServiceRow({
  user,
  services,
  isServiceEnabledForUser,
  onToggleUserService,
  onEnableAllServices,
  isEnablingAll
}: UserServiceRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">
            {user.first_name || user.last_name 
              ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
              : user.email.split('@')[0]
            }
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-2">
          {services.map((service) => {
            const isEnabled = isServiceEnabledForUser(user.id, service.id);
            return (
              <div key={service.id} className="flex items-center gap-2">
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => 
                    onToggleUserService(user.id, service.id, checked)
                  }
                  disabled={!service.is_active}
                />
                <Badge
                  variant={isEnabled ? "default" : "secondary"}
                  className={`text-xs ${service.is_premium ? 'bg-yellow-100 text-yellow-800' : ''}`}
                >
                  {service.name}
                  {service.is_premium && <Crown className="w-3 h-3 ml-1" />}
                </Badge>
              </div>
            );
          })}
        </div>
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          onClick={() => onEnableAllServices(user.id)}
          disabled={isEnablingAll}
        >
          Enable All
        </Button>
      </TableCell>
    </TableRow>
  );
}
