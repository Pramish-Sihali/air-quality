'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, Info, Bell } from 'lucide-react';
import { Alert as AlertType } from '@/data/recommendations-data';

// Get alert icon based on severity
export function getAlertIcon(severity: string) {
  switch (severity) {
    case 'high': return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'medium': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'low': return <Info className="h-5 w-5 text-blue-500" />;
    default: return <Bell className="h-5 w-5 text-gray-500" />;
  }
}

// Alert notification item component
export function AlertItem({ alert }: { alert: AlertType }) {
  return (
    <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
      <div className="flex items-start gap-3">
        {getAlertIcon(alert.severity)}
        <div>
          <div className="font-medium text-sm">{alert.title}</div>
          <div className="text-xs text-gray-600 mt-1">{alert.message}</div>
          <div className="text-xs text-gray-400 mt-1">{alert.time}</div>
        </div>
      </div>
    </div>
  );
}