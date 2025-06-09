
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, userRole, isLoading: authLoading } = useAuth();

  useEffect(() => {
    console.log('AuthPage effect - user:', user?.email, 'role:', userRole, 'loading:', authLoading);
    
    // Only redirect if we have both user and role, and auth is not loading
    if (!authLoading && user && userRole) {
      console.log('Redirecting user based on role:', userRole);
      
      // Add a small delay to ensure state is fully updated
      setTimeout(() => {
        if (userRole === 'admin') {
          console.log('Redirecting admin to /admin');
          navigate("/admin", { replace: true });
        } else {
          console.log('Redirecting user to /dashboard');
          navigate("/dashboard", { replace: true });
        }
      }, 100);
    }
  }, [user, userRole, authLoading, navigate]);

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render the auth form if user is already authenticated (prevents flash)
  if (user && userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Mobiwave Innovations</CardTitle>
          <CardDescription>Access your messaging platform</CardDescription>
          <div className="flex justify-center mt-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Auth Service: Active
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="text-xs text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Auth Service:</span>
                <span className="text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span>Security Level:</span>
                <span className="text-green-600">Enterprise</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
