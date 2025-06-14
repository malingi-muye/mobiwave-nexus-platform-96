
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useServiceActivation } from '@/hooks/useServiceActivation';

interface ServiceCatalog {
  id: string;
  service_name: string;
  service_type: string;
  description: string;
  setup_fee: number;
  monthly_fee: number;
  is_premium: boolean;
}

interface ServiceRequestCardProps {
  service: ServiceCatalog;
  isActivated: boolean;
}

export function ServiceRequestCard({ service, isActivated }: ServiceRequestCardProps) {
  const { requestServiceActivation, isRequesting } = useServiceActivation();

  const handleRequestAccess = async () => {
    try {
      await requestServiceActivation(service.id);
    } catch (error) {
      console.error('Failed to request service access:', error);
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'ussd': return '📱';
      case 'shortcode': return '💬';
      case 'mpesa': return '💳';
      case 'survey': return '📊';
      case 'servicedesk': return '🎫';
      case 'rewards': return '🎁';
      case 'whatsapp': return '💚';
      case 'sms': return '📧';
      default: return '⚙️';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className={`${isActivated ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getServiceIcon(service.service_type)}</span>
            <div>
              <CardTitle className="text-lg">{service.service_name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs capitalize">
                  {service.service_type}
                </Badge>
                {service.is_premium && (
                  <Badge className="text-xs bg-gold-100 text-gold-800">
                    Premium
                  </Badge>
                )}
                {isActivated && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    Activated
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{service.description}</p>
        
        <div className="space-y-2 mb-4">
          {service.setup_fee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Setup Fee:</span>
              <span className="font-medium">{formatCurrency(service.setup_fee)}</span>
            </div>
          )}
          {service.monthly_fee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Monthly Fee:</span>
              <span className="font-medium">{formatCurrency(service.monthly_fee)}</span>
            </div>
          )}
        </div>

        {!isActivated && (
          <Button 
            onClick={handleRequestAccess}
            disabled={isRequesting}
            className="w-full"
          >
            {isRequesting ? 'Requesting...' : 'Request Access'}
          </Button>
        )}
        
        {isActivated && (
          <Button disabled className="w-full bg-green-600">
            Service Activated
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
