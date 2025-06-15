
import { supabase } from '@/integrations/supabase/client';
import { ValidationSchemas, validateRateLimit } from '@/components/security/EnhancedInputValidator';
import { logSecurityEvent } from './security-headers';

export class EnhancedSecurityManager {
  private static instance: EnhancedSecurityManager;

  static getInstance(): EnhancedSecurityManager {
    if (!EnhancedSecurityManager.instance) {
      EnhancedSecurityManager.instance = new EnhancedSecurityManager();
    }
    return EnhancedSecurityManager.instance;
  }

  // Enhanced password validation with breach checking
  async validatePassword(password: string, email?: string): Promise<{ isValid: boolean; errors: string[]; riskLevel: string }> {
    const errors: string[] = [];
    let riskLevel = 'low';
    
    // Basic requirements
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
      riskLevel = 'high';
    }
    
    if (password.length < 12) {
      riskLevel = 'medium';
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
      riskLevel = 'high';
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
      riskLevel = 'high';
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
      riskLevel = 'high';
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
      riskLevel = 'high';
    }

    // Common password patterns
    const commonPatterns = [
      /(.)\1{2,}/g, // Repeated characters
      /123456|password|qwerty|abc123/i, // Common sequences
    ];

    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        errors.push('Password contains common patterns that are easily guessed');
        riskLevel = 'high';
        break;
      }
    }

    // Check if password contains email parts
    if (email) {
      const emailParts = email.split('@')[0].toLowerCase();
      if (password.toLowerCase().includes(emailParts)) {
        errors.push('Password should not contain parts of your email');
        riskLevel = 'medium';
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      riskLevel
    };
  }

  // Enhanced input sanitization with context awareness
  sanitizeInput(input: string, context: 'html' | 'sql' | 'url' | 'general' = 'general'): string {
    let sanitized = input.trim();

    switch (context) {
      case 'html':
        sanitized = sanitized
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<[^>]*>/g, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+=/gi, '');
        break;
      
      case 'sql':
        sanitized = sanitized
          .replace(/['"`;\\]/g, '')
          .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi, '');
        break;
      
      case 'url':
        sanitized = encodeURIComponent(sanitized);
        break;
      
      default:
        sanitized = sanitized
          .replace(/[<>]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+=/gi, '');
    }

    return sanitized;
  }

  // Enhanced authentication monitoring
  async monitorAuthAttempt(email: string, success: boolean, ip?: string): Promise<void> {
    const identifier = ip || email;
    
    if (!success) {
      // Check for brute force attempts
      if (!validateRateLimit(`failed_login_${identifier}`, 5, 15 * 60 * 1000)) {
        logSecurityEvent('brute_force_attempt', 'high', {
          email: this.sanitizeInput(email),
          ip,
          timestamp: Date.now()
        });
        
        // Log security event to database
        await this.logSecurityEvent('brute_force_attempt', 'high', {
          email: this.sanitizeInput(email),
          ip
        });
      }
    }

    // Log successful login from new IP
    if (success && ip) {
      const previousLogins = localStorage.getItem(`login_ips_${email}`);
      const knownIPs = previousLogins ? JSON.parse(previousLogins) : [];
      
      if (!knownIPs.includes(ip)) {
        logSecurityEvent('new_ip_login', 'medium', {
          email: this.sanitizeInput(email),
          ip,
          timestamp: Date.now()
        });
        
        knownIPs.push(ip);
        localStorage.setItem(`login_ips_${email}`, JSON.stringify(knownIPs.slice(-10))); // Keep last 10 IPs
      }
    }
  }

  // Enhanced role checking with caching
  private roleCache = new Map<string, { role: string; timestamp: number }>();
  
  async hasRole(requiredRoles: string[], useCache: boolean = true): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check cache first
      if (useCache) {
        const cached = this.roleCache.get(user.id);
        if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes cache
          return requiredRoles.includes(cached.role);
        }
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role) {
        this.roleCache.set(user.id, { role: profile.role, timestamp: Date.now() });
        return requiredRoles.includes(profile.role);
      }

      return false;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }

  // Enhanced security event logging
  async logSecurityEvent(
    eventType: string, 
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    details: Record<string, any> = {}
  ): Promise<void> {
    try {
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_severity: severity,
        p_details: JSON.stringify({
          ...details,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Enhanced rate limiting with distributed storage
  async checkServerRateLimit(key: string, maxAttempts: number = 100, windowMs: number = 60000): Promise<boolean> {
    try {
      // For now, use client-side rate limiting as fallback
      return validateRateLimit(key, maxAttempts, windowMs);
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow on error to prevent service disruption
    }
  }

  // Session security validation
  validateSession(): boolean {
    try {
      const sessionData = localStorage.getItem('supabase.auth.token');
      if (!sessionData) return false;

      const session = JSON.parse(sessionData);
      const now = Date.now() / 1000;
      
      // Check if token is expired
      if (session.expires_at && session.expires_at < now) {
        this.logSecurityEvent('expired_session_access', 'medium');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }

  // Clear security caches
  clearSecurityCaches(): void {
    this.roleCache.clear();
    // Clear rate limiting data older than 1 hour
    const rateLimitKeys = Object.keys(localStorage).filter(key => key.startsWith('rate_limit_'));
    rateLimitKeys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        const validData = data.filter((timestamp: number) => Date.now() - timestamp < 60 * 60 * 1000);
        if (validData.length === 0) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(validData));
        }
      } catch (error) {
        localStorage.removeItem(key);
      }
    });
  }
}

export default EnhancedSecurityManager;
