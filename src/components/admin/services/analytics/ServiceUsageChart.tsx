
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ServiceUsageData {
  service_name: string;
  active_users: number;
  total_users: number;
  adoption_rate: number;
}

interface ServiceUsageChartProps {
  data: ServiceUsageData[];
}

export function ServiceUsageChart({ data }: ServiceUsageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Adoption Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="service_name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [
                name === 'adoption_rate' ? `${value.toFixed(1)}%` : value,
                name === 'adoption_rate' ? 'Adoption Rate' : 
                name === 'active_users' ? 'Active Users' : 'Total Users'
              ]}
            />
            <Bar dataKey="active_users" fill="#3b82f6" name="active_users" />
            <Bar dataKey="adoption_rate" fill="#10b981" name="adoption_rate" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
