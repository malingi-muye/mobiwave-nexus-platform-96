
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Shield, CheckCircle } from 'lucide-react';

interface CompleteUserStatsProps {
  stats: {
    total: number;
    with_profiles: number;
    without_profiles: number;
    admin_users: number;
    confirmed: number;
  };
}

export function CompleteUserStats({ stats }: CompleteUserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700">
            <Users className="w-4 h-4" />
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700">
            <UserCheck className="w-4 h-4" />
            With Profiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900">{stats.with_profiles}</div>
          <div className="text-xs text-green-600">Complete accounts</div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-700">
            <UserX className="w-4 h-4" />
            Missing Profiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-900">{stats.without_profiles}</div>
          <div className="text-xs text-amber-600">Need attention</div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700">
            <Shield className="w-4 h-4" />
            Admin Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-900">{stats.admin_users}</div>
          <div className="text-xs text-purple-600">Elevated access</div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-teal-700">
            <CheckCircle className="w-4 h-4" />
            Verified
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-teal-900">{stats.confirmed}</div>
          <div className="text-xs text-teal-600">Email confirmed</div>
        </CardContent>
      </Card>
    </div>
  );
}
