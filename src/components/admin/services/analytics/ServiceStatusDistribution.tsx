
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatusData {
  status: string;
  count: number;
  percentage: number;
}

interface ServiceStatusDistributionProps {
  data: StatusData[];
}

const COLORS = {
  active: '#10b981',
  subscribed: '#3b82f6',
  pending: '#f59e0b',
  available: '#6b7280',
  inactive: '#ef4444'
};

export function ServiceStatusDistribution({ data }: ServiceStatusDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ status, percentage }) => `${status}: ${percentage.toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.status as keyof typeof COLORS] || '#6b7280'} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [value, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
