
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Crown } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  route: string;
  is_active: boolean;
  is_premium: boolean;
}

interface GlobalServiceRowProps {
  service: Service;
  onUpdateServiceStatus: (serviceId: string, isActive: boolean) => void;
}

export function GlobalServiceRow({
  service,
  onUpdateServiceStatus
}: GlobalServiceRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium flex items-center gap-2">
            {service.name}
            {service.is_premium && <Crown className="w-4 h-4 text-yellow-600" />}
          </div>
          <div className="text-sm text-gray-500">{service.description}</div>
        </div>
      </TableCell>
      <TableCell>
        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
          {service.route}
        </code>
      </TableCell>
      <TableCell>
        <Badge variant={service.is_premium ? "default" : "secondary"}>
          {service.is_premium ? 'Premium' : 'Standard'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={service.is_active ? "default" : "destructive"}>
          {service.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell>
        <Switch
          checked={service.is_active}
          onCheckedChange={(checked) => 
            onUpdateServiceStatus(service.id, checked)
          }
        />
      </TableCell>
    </TableRow>
  );
}
