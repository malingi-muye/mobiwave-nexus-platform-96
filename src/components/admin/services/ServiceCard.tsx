
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown } from 'lucide-react';
import { PricingDisplay } from './PricingDisplay';

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

interface ServiceCardProps {
  service: ServiceCatalog;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'ussd': return '📱';
      case 'shortcode': return '💬';
      case 'mpesa': return '💳';
      case 'survey': return '📊';
      case 'servicedesk': return '🎫';
      case 'rewards': return '🎁';
      case 'whatsapp': return '💚';
      default: return '⚙️';
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getServiceIcon(service.service_type)}</span>
            <div>
              <h3 className="font-semibold text-sm">{service.service_name}</h3>
              <p className="text-xs text-gray-500 capitalize">{service.service_type}</p>
            </div>
          </div>
          {service.is_premium && <Crown className="w-4 h-4 text-yellow-600" />}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-gray-600 mb-3">{service.description}</p>
        
        <PricingDisplay
          setupFee={service.setup_fee}
          monthlyFee={service.monthly_fee}
          transactionFeeType={service.transaction_fee_type}
          transactionFeeAmount={service.transaction_fee_amount}
        />

        <div className="flex items-center justify-between mt-3">
          <Badge variant={service.is_active ? "default" : "secondary"}>
            {service.is_active ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {service.provider}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
