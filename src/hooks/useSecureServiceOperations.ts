
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { serviceValidationSchema, validateRateLimit, sanitizeInput } from '@/lib/validation-schemas';
import AuditLogger from '@/lib/audit-logger';

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

export function useSecureServiceOperations() {
  const queryClient = useQueryClient();
  const auditLogger = AuditLogger.getInstance();

  const updateService = useMutation({
    mutationFn: async (service: ServiceCatalog) => {
      // Rate limiting check
      if (!validateRateLimit('update_service', 10)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Input validation and sanitization
      const validatedData = serviceValidationSchema.parse({
        ...service,
        service_name: sanitizeInput(service.service_name),
        description: service.description ? sanitizeInput(service.description) : null
      });

      // Log the operation attempt
      await auditLogger.logAction(
        'system',
        'service_update_attempt',
        {
          resourceType: 'service',
          resourceId: service.id,
          severity: 'medium',
          metadata: { service_name: validatedData.service_name }
        }
      );

      const { data, error } = await supabase
        .from('services_catalog')
        .update({
          service_name: validatedData.service_name,
          service_type: validatedData.service_type,
          description: validatedData.description,
          setup_fee: validatedData.setup_fee,
          monthly_fee: validatedData.monthly_fee,
          transaction_fee_type: validatedData.transaction_fee_type,
          transaction_fee_amount: validatedData.transaction_fee_amount,
          is_premium: validatedData.is_premium,
          is_active: validatedData.is_active,
          provider: validatedData.provider
        })
        .eq('id', service.id)
        .select()
        .single();

      if (error) {
        // Log the error without exposing sensitive details
        await auditLogger.logAction(
          'system',
          'service_update_failed',
          {
            resourceType: 'service',
            resourceId: service.id,
            severity: 'high',
            metadata: { error_code: error.code }
          }
        );
        throw new Error('Failed to update service. Please try again.');
      }

      // Log successful operation
      await auditLogger.logAction(
        'system',
        'service_update_success',
        {
          resourceType: 'service',
          resourceId: service.id,
          severity: 'low',
          metadata: { service_name: validatedData.service_name }
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services-catalog'] });
      toast.success('Service updated successfully');
    },
    onError: (error: Error) => {
      console.error('Service update failed:', error.message);
      toast.error(error.message || 'Failed to update service');
    }
  });

  const toggleServiceStatus = useMutation({
    mutationFn: async ({ serviceId, isActive }: { serviceId: string; isActive: boolean }) => {
      // Rate limiting check
      if (!validateRateLimit('toggle_service', 20)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Input validation
      if (!serviceId || typeof serviceId !== 'string') {
        throw new Error('Invalid service ID');
      }

      if (typeof isActive !== 'boolean') {
        throw new Error('Invalid status value');
      }

      // Log the operation attempt
      await auditLogger.logAction(
        'system',
        'service_status_toggle_attempt',
        {
          resourceType: 'service',
          resourceId: serviceId,
          severity: 'medium',
          metadata: { new_status: isActive }
        }
      );

      const { data, error } = await supabase
        .from('services_catalog')
        .update({ is_active: isActive })
        .eq('id', serviceId)
        .select()
        .single();

      if (error) {
        // Log the error
        await auditLogger.logAction(
          'system',
          'service_status_toggle_failed',
          {
            resourceType: 'service',
            resourceId: serviceId,
            severity: 'high',
            metadata: { error_code: error.code }
          }
        );
        throw new Error('Failed to update service status. Please try again.');
      }

      // Log successful operation
      await auditLogger.logAction(
        'system',
        'service_status_toggle_success',
        {
          resourceType: 'service',
          resourceId: serviceId,
          severity: 'low',
          metadata: { new_status: isActive }
        }
      );

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services-catalog'] });
      toast.success(`Service ${variables.isActive ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error: Error) => {
      console.error('Service status toggle failed:', error.message);
      toast.error(error.message || 'Failed to update service status');
    }
  });

  return {
    updateService: updateService.mutateAsync,
    toggleServiceStatus: toggleServiceStatus.mutateAsync,
    isUpdating: updateService.isPending || toggleServiceStatus.isPending
  };
}
