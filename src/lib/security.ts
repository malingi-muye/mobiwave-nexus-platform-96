
import { supabase } from '@/integrations/supabase/client';

export class SecurityManager {
  private static instance: SecurityManager;

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // Password validation
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Input sanitization
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Email validation
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone number validation
  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  // Check if user has required role
  async hasRole(requiredRoles: string[]): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      return profile?.role && requiredRoles.includes(profile.role);
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }

  // Log security events
  async logSecurityEvent(
    eventType: string, 
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    details: Record<string, any> = {}
  ): Promise<void> {
    try {
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_severity: severity,
        p_details: JSON.stringify(details)
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Rate limiting check (client-side basic implementation)
  checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const storageKey = `rate_limit_${key}`;
    
    try {
      const stored = localStorage.getItem(storageKey);
      const attempts = stored ? JSON.parse(stored) : [];
      
      // Remove old attempts outside the window
      const validAttempts = attempts.filter((time: number) => now - time < windowMs);
      
      if (validAttempts.length >= maxAttempts) {
        return false; // Rate limit exceeded
      }
      
      // Add current attempt
      validAttempts.push(now);
      localStorage.setItem(storageKey, JSON.stringify(validAttempts));
      
      return true; // Within rate limit
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow on error
    }
  }

  // Validate TLS configuration
  validateTLSConfig(): boolean {
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  }

  // Generate secure random token
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export default SecurityManager;
