
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { USSDConfigurationForm } from './configuration/USSDConfigurationForm';
import { MpesaConfigurationForm } from './configuration/MpesaConfigurationForm';
import { ShortCodeConfigurationForm } from './configuration/ShortCodeConfigurationForm';

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

interface ServiceConfigurationWizardProps {
  services: ServiceCatalog[];
  selectedService: ServiceCatalog | null;
  onServiceSelect: (service: ServiceCatalog) => void;
  onServiceConfigured: (serviceId: string, configuration: any) => Promise<void>;
}

export function ServiceConfigurationWizard({
  services,
  selectedService,
  onServiceSelect,
  onServiceConfigured
}: ServiceConfigurationWizardProps) {
  const [configuration, setConfiguration] = useState<any>({});
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleConfigurationChange = (field: string, value: any) => {
    setConfiguration(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitConfiguration = async () => {
    if (!selectedService) {
      toast.error('Please select a service first');
      return;
    }

    setIsConfiguring(true);
    try {
      await onServiceConfigured(selectedService.id, configuration);
      toast.success('Service configuration saved successfully');
      setConfiguration({});
    } catch (error: any) {
      toast.error(`Failed to save configuration: ${error.message}`);
    } finally {
      setIsConfiguring(false);
    }
  };

  const renderConfigurationForm = () => {
    if (!selectedService) return null;

    switch (selectedService.service_type) {
      case 'ussd':
        return (
          <USSDConfigurationForm
            configuration={configuration}
            onConfigurationChange={handleConfigurationChange}
          />
        );
      case 'mpesa':
        return (
          <MpesaConfigurationForm
            configuration={configuration}
            onConfigurationChange={handleConfigurationChange}
          />
        );
      case 'shortcode':
        return (
          <ShortCodeConfigurationForm
            configuration={configuration}
            onConfigurationChange={handleConfigurationChange}
          />
        );
      default:
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="general-config">General Configuration</Label>
                  <Textarea
                    id="general-config"
                    placeholder="Enter JSON configuration..."
                    value={JSON.stringify(configuration, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setConfiguration(parsed);
                      } catch {
                        // Invalid JSON, ignore
                      }
                    }}
                    rows={10}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Service Selection */}
      <div className="space-y-4">
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
      </div>

      {/* Configuration Form */}
      <div className="lg:col-span-2 space-y-4">
        {selectedService ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Configure {selectedService.service_name}</span>
                  <Badge variant={selectedService.is_premium ? "default" : "secondary"}>
                    {selectedService.is_premium ? 'Premium' : 'Standard'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedService.description}
                </p>
                <Separator className="mb-4" />
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <span className="text-gray-500">Setup Fee:</span>
                    <span className="ml-2 font-medium">
                      KES {selectedService.setup_fee.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Monthly Fee:</span>
                    <span className="ml-2 font-medium">
                      KES {selectedService.monthly_fee.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {renderConfigurationForm()}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  onServiceSelect(null as any);
                  setConfiguration({});
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitConfiguration}
                disabled={isConfiguring}
              >
                {isConfiguring ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Select a Service</h3>
              <p className="text-gray-600">
                Choose a service from the left panel to configure its settings.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
