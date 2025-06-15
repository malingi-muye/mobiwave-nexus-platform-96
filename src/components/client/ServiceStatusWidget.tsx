
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useClientServiceSync } from '@/hooks/useClientServiceSync';
import { useNavigate } from 'react-router-dom';

export function ServiceStatusWidget() {
  const { data: services = [], isLoading } = useClientServiceSync();
  const navigate = useNavigate();

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

  const getStatusColor = (service: any) => {
    if (!service.is_active) return 'bg-red-100 text-red-800';
    if (!service.setup_fee_paid) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusIcon = (service: any) => {
    if (!service.is_active) return <AlertCircle className="w-3 h-3" />;
    if (!service.setup_fee_paid) return <Clock className="w-3 h-3" />;
    return <CheckCircle className="w-3 h-3" />;
  };

  const getStatusText = (service: any) => {
    if (!service.is_active) return 'Inactive';
    if (!service.setup_fee_paid) return 'Setup Pending';
    return 'Active';
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            My Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            My Services ({services.length})
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/services')}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No active services yet</p>
            <Button onClick={() => navigate('/services')}>
              Browse Services
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {services.slice(0, 5).map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getServiceIcon(service.service_type)}</span>
                  <div>
                    <div className="font-medium">{service.service_name}</div>
                    <div className="text-sm text-gray-500 capitalize">{service.service_type}</div>
                  </div>
                </div>
                <Badge className={getStatusColor(service)} variant="secondary">
                  {getStatusIcon(service)}
                  <span className="ml-1">{getStatusText(service)}</span>
                </Badge>
              </div>
            ))}
            {services.length > 5 && (
              <div className="text-center pt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/services')}
                >
                  View {services.length - 5} more services
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
