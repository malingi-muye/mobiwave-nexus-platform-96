
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Activity, 
  LogIn, 
  UserPlus, 
  Settings, 
  Mail, 
  Phone,
  Clock
} from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  user_id: string;
  created_at: string;
  metadata: any;
  ip_address: string;
  user_agent: string;
}

const fetchUserActivity = async (): Promise<ActivityLog[]> => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data || [];
};

export function UserActivityFeed() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['user-activity'],
    queryFn: fetchUserActivity
  });

  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login': return LogIn;
      case 'signup': return UserPlus;
      case 'settings_update': return Settings;
      case 'email_sent': return Mail;
      case 'sms_sent': return Phone;
      default: return Activity;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login': return 'text-green-600 bg-green-50';
      case 'signup': return 'text-blue-600 bg-blue-50';
      case 'settings_update': return 'text-orange-600 bg-orange-50';
      case 'email_sent': return 'text-purple-600 bg-purple-50';
      case 'sms_sent': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const ActivityIcon = getActivityIcon(activity.action);
            const colorClass = getActivityColor(activity.action);
            
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <ActivityIcon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {activity.action.replace('_', ' ')}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {activity.user_id?.slice(0, 8)}...
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {activity.metadata?.description || 'User activity recorded'}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(activity.created_at).toLocaleString()}
                    </div>
                    {activity.ip_address && (
                      <div>IP: {activity.ip_address}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {activities.length === 0 && (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
              <p className="text-gray-600">
                User activity will appear here as it happens.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
