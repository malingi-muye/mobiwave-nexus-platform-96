
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ServiceCatalog {
  id: string;
  service_name: string;
  service_type: string;
  description: string;
  setup_fee: number;
  monthly_fee: number;
  transaction_fee_type: string;
  transaction_fee_amount: number;
  is_premium: boolean;
  is_active: boolean;
  provider: string;
}

interface ServiceDetailsCardProps {
  service: ServiceCatalog;
}

export function ServiceDetailsCard({ service }: ServiceDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Configure {service.service_name}</span>
          <Badge variant={service.is_premium ? "default" : "secondary"}>
            {service.is_premium ? 'Premium' : 'Standard'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          {service.description}
        </p>
        <Separator className="mb-4" />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Setup Fee:</span>
            <span className="ml-2 font-medium">
              KES {service.setup_fee.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Monthly Fee:</span>
            <span className="ml-2 font-medium">
              KES {service.monthly_fee.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
