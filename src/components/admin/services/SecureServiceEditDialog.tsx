
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serviceValidationSchema, sanitizeInput, type ServiceFormData } from '@/lib/validation-schemas';
import { toast } from 'sonner';

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

interface SecureServiceEditDialogProps {
  service: ServiceCatalog | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: ServiceCatalog) => void;
  isLoading: boolean;
}

export function SecureServiceEditDialog({ 
  service, 
  isOpen, 
  onClose, 
  onSave, 
  isLoading 
}: SecureServiceEditDialogProps) {
  const [formData, setFormData] = useState<ServiceCatalog | null>(service);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(service);
    setValidationErrors({});
  }, [service]);

  if (!formData) return null;

  const validateField = (field: keyof ServiceFormData, value: any) => {
    try {
      const fieldSchema = serviceValidationSchema.shape[field];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } catch (error: any) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: error.errors?.[0]?.message || 'Invalid value'
      }));
    }
  };

  const handleInputChange = (field: keyof ServiceCatalog, value: any) => {
    let sanitizedValue = value;
    
    // Sanitize string inputs
    if (typeof value === 'string') {
      sanitizedValue = sanitizeInput(value);
    }
    
    // Validate numeric inputs
    if (field === 'setup_fee' || field === 'monthly_fee' || field === 'transaction_fee_amount') {
      const numValue = parseFloat(value) || 0;
      if (numValue < 0) {
        toast.error('Negative values are not allowed');
        return;
      }
      sanitizedValue = numValue;
    }

    setFormData(prev => prev ? { ...prev, [field]: sanitizedValue } : null);
    validateField(field, sanitizedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;

    try {
      // Validate entire form
      const validatedData = serviceValidationSchema.parse(formData);
      
      // Check for any remaining validation errors
      if (Object.keys(validationErrors).length > 0) {
        toast.error('Please fix validation errors before saving');
        return;
      }

      onSave({ ...formData, ...validatedData });
    } catch (error: any) {
      console.error('Validation failed:', error);
      toast.error('Please check all required fields and try again');
      
      // Set validation errors for display
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setValidationErrors(newErrors);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service: {formData.service_name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_name">Service Name *</Label>
              <Input
                id="service_name"
                value={formData.service_name}
                onChange={(e) => handleInputChange('service_name', e.target.value)}
                className={validationErrors.service_name ? 'border-red-500' : ''}
                maxLength={100}
                required
              />
              {validationErrors.service_name && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.service_name}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="service_type">Service Type *</Label>
              <Select 
                value={formData.service_type} 
                onValueChange={(value) => handleInputChange('service_type', value)}
              >
                <SelectTrigger className={validationErrors.service_type ? 'border-red-500' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="ussd">USSD</SelectItem>
                  <SelectItem value="shortcode">Short Code</SelectItem>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="survey">Survey</SelectItem>
                  <SelectItem value="servicedesk">Service Desk</SelectItem>
                  <SelectItem value="rewards">Rewards</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.service_type && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.service_type}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={validationErrors.description ? 'border-red-500' : ''}
              maxLength={500}
              rows={3}
              placeholder="Enter service description (HTML tags will be removed for security)"
            />
            {validationErrors.description && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="setup_fee">Setup Fee *</Label>
              <Input
                id="setup_fee"
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                value={formData.setup_fee}
                onChange={(e) => handleInputChange('setup_fee', parseFloat(e.target.value) || 0)}
                className={validationErrors.setup_fee ? 'border-red-500' : ''}
              />
              {validationErrors.setup_fee && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.setup_fee}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="monthly_fee">Monthly Fee *</Label>
              <Input
                id="monthly_fee"
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                value={formData.monthly_fee}
                onChange={(e) => handleInputChange('monthly_fee', parseFloat(e.target.value) || 0)}
                className={validationErrors.monthly_fee ? 'border-red-500' : ''}
              />
              {validationErrors.monthly_fee && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.monthly_fee}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transaction_fee_type">Transaction Fee Type</Label>
              <Select 
                value={formData.transaction_fee_type} 
                onValueChange={(value) => handleInputChange('transaction_fee_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="transaction_fee_amount">Transaction Fee Amount</Label>
              <Input
                id="transaction_fee_amount"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.transaction_fee_amount}
                onChange={(e) => handleInputChange('transaction_fee_amount', parseFloat(e.target.value) || 0)}
                className={validationErrors.transaction_fee_amount ? 'border-red-500' : ''}
              />
              {validationErrors.transaction_fee_amount && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.transaction_fee_amount}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="provider">Provider</Label>
            <Select 
              value={formData.provider} 
              onValueChange={(value) => handleInputChange('provider', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mspace">MSpace</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="third-party">Third Party</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_premium"
                checked={formData.is_premium}
                onCheckedChange={(checked) => handleInputChange('is_premium', checked)}
              />
              <Label htmlFor="is_premium">Premium Service</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || Object.keys(validationErrors).length > 0}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
