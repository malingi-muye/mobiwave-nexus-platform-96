
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  month: string;
  setup_fees: number;
  monthly_fees: number;
  total: number;
}

interface ServiceRevenueChartProps {
  data: RevenueData[];
}

export function ServiceRevenueChart({ data }: ServiceRevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`KSh ${value.toLocaleString()}`, '']}
            />
            <Line 
              type="monotone" 
              dataKey="setup_fees" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Setup Fees"
            />
            <Line 
              type="monotone" 
              dataKey="monthly_fees" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Monthly Fees"
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Total Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
