
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ServiceConfiguration {
  [key: string]: any;
}

export function useServiceConfiguration() {
  const [configuration, setConfiguration] = useState<ServiceConfiguration>({});
  const [isConfiguring, setIsConfiguring] = useState(false);

  const updateConfiguration = useCallback((field: string, value: any) => {
    setConfiguration(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetConfiguration = useCallback(() => {
    setConfiguration({});
  }, []);

  const saveConfiguration = useCallback(async (
    serviceId: string, 
    config: ServiceConfiguration,
    onSave: (serviceId: string, configuration: any) => Promise<void>
  ) => {
    if (!serviceId) {
      toast.error('Please select a service first');
      return false;
    }

    setIsConfiguring(true);
    try {
      await onSave(serviceId, config);
      toast.success('Service configuration saved successfully');
      resetConfiguration();
      return true;
    } catch (error: any) {
      toast.error(`Failed to save configuration: ${error.message}`);
      return false;
    } finally {
      setIsConfiguring(false);
    }
  }, [resetConfiguration]);

  return {
    configuration,
    isConfiguring,
    updateConfiguration,
    resetConfiguration,
    saveConfiguration
  };
}
