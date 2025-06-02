
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface CampaignStatusProps {
  checkBalance: any;
}

export function CampaignStatus({ checkBalance }: CampaignStatusProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Mspace API Integration Active</span>
          {checkBalance.data && (
            <span className="text-purple-600">
              • Provider Balance: {checkBalance.data.currency} {checkBalance.data.balance}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
