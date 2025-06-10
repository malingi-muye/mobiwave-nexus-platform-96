
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function SignupForm({ isLoading, setIsLoading }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Starting signup process...', { email, firstName, lastName });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'user'
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          toast.error('An account with this email already exists. Please try logging in instead.');
        } else if (error.message.includes('Database error')) {
          toast.error('Database error occurred. Please try again or contact support.');
        } else if (error.message.includes('Invalid email')) {
          toast.error('Please enter a valid email address.');
        } else {
          toast.error(`Signup failed: ${error.message}`);
        }
        return;
      }

      if (data.user) {
        console.log('User created successfully:', data.user);
        
        // Check if email confirmation is required
        if (data.user.email_confirmed_at) {
          toast.success('Account created successfully! You can now log in.');
        } else {
          toast.success('Account created! Please check your email to confirm your account before logging in.');
        }
        
        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
      } else {
        console.warn('No user data returned from signup');
        toast.error('Signup completed but user data not received. Please try logging in.');
      }
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast.error(`An unexpected error occurred: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pl-10"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signupEmail">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="signupEmail"
            type="email"
            placeholder="user@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signupPassword">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="signupPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            required
            minLength={6}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-slate-400" />
            ) : (
              <Eye className="h-4 w-4 text-slate-400" />
            )}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
      
      <div className="text-sm text-gray-600 mt-4">
        <p>By creating an account, you agree to our terms of service and privacy policy.</p>
      </div>
    </form>
  );
}
