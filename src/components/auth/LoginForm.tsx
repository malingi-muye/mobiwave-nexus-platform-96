
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [accountLocked, setAccountLocked] = useState(false);
  const { login } = useAuth();

  const logSecurityEvent = async (eventType: string, severity: string = 'medium', details: any = {}) => {
    try {
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_severity: severity,
        p_details: JSON.stringify(details)
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    let profile = null;

    try {
      // Check if account is locked first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('failed_login_attempts, locked_until')
        .eq('email', email)
        .single();

      profile = profileData;

      if (profile?.locked_until && new Date(profile.locked_until) > new Date()) {
        setAccountLocked(true);
        setError('Account is temporarily locked due to multiple failed login attempts. Please try again later.');
        
        await logSecurityEvent('login_attempt_on_locked_account', 'high', {
          email,
          locked_until: profile.locked_until
        });
        
        setIsLoading(false);
        return;
      }

      await login(email, password);
      
      // Reset failed attempts on successful login
      await supabase
        .from('profiles')
        .update({ 
          failed_login_attempts: 0, 
          locked_until: null 
        })
        .eq('email', email);

      await logSecurityEvent('successful_login', 'low', { email });
      
      toast.success('Successfully logged in!');
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Increment failed login attempts
      if (profile) {
        const newFailedAttempts = (profile.failed_login_attempts || 0) + 1;
        const shouldLock = newFailedAttempts >= 5;
        const lockUntil = shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null; // 15 minutes

        await supabase
          .from('profiles')
          .update({ 
            failed_login_attempts: newFailedAttempts,
            locked_until: lockUntil?.toISOString()
          })
          .eq('email', email);

        if (shouldLock) {
          setAccountLocked(true);
          setError('Account locked due to multiple failed login attempts. Please try again in 15 minutes.');
          
          await logSecurityEvent('account_locked', 'high', {
            email,
            failed_attempts: newFailedAttempts,
            locked_until: lockUntil?.toISOString()
          });
        } else {
          setError(`Invalid credentials. ${5 - newFailedAttempts} attempts remaining before account lock.`);
          
          await logSecurityEvent('failed_login_attempt', 'medium', {
            email,
            failed_attempts: newFailedAttempts,
            error_message: error.message
          });
        }
      } else {
        setError('Invalid email or password');
        
        await logSecurityEvent('failed_login_unknown_email', 'medium', {
          email,
          error_message: error.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {accountLocked && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                For security reasons, this account has been temporarily locked. 
                If you believe this is an error, please contact support.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={accountLocked}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={accountLocked}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
                disabled={accountLocked}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || accountLocked}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
