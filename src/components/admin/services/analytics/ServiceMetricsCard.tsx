
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ServiceMetricsCardProps {
  title: string;
  value: number;
  previousValue?: number;
  format?: 'number' | 'percentage' | 'currency';
  icon?: React.ReactNode;
}

export function ServiceMetricsCard({ 
  title, 
  value, 
  previousValue, 
  format = 'number',
  icon 
}: ServiceMetricsCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return `KSh ${val.toLocaleString()}`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrend = () => {
    if (previousValue === undefined) return null;
    
    const change = value - previousValue;
    const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0;
    
    if (change > 0) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <TrendingUp className="w-3 h-3 mr-1" />
          +{changePercent.toFixed(1)}%
        </Badge>
      );
    } else if (change < 0) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <TrendingDown className="w-3 h-3 mr-1" />
          {changePercent.toFixed(1)}%
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
          <Minus className="w-3 h-3 mr-1" />
          0%
        </Badge>
      );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {getTrend() && (
          <div className="mt-2">
            {getTrend()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
