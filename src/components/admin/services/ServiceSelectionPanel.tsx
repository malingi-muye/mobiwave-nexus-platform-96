
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface ServiceSelectionPanelProps {
  services: ServiceCatalog[];
  selectedService: ServiceCatalog | null;
  onServiceSelect: (service: ServiceCatalog) => void;
}

export function ServiceSelectionPanel({ 
  services, 
  selectedService, 
  onServiceSelect 
}: ServiceSelectionPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedService?.id === service.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onServiceSelect(service)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">{service.service_name}</h4>
              <Badge variant="outline" className="text-xs">
                {service.service_type}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">
              {service.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
