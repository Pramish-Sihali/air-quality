// components/profile/ProfileDialog.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { ProfilePage } from './ProfilePage';
import { RouteForm } from './RouteForm';
import { useProfile } from '@/contexts/ProfileContext';
import { Route } from '@/types/routes';

interface ProfileDialogProps {
  trigger?: React.ReactNode;
  className?: string;
}

export function ProfileDialog({ trigger, className }: ProfileDialogProps) {
  const { profile, addRoute } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);
  
  // Check if user has routes when dialog opens
  useEffect(() => {
    if (isOpen) {
      setShowRouteForm(profile.routes.length === 0);
    }
  }, [isOpen, profile.routes.length]);
  
  const handleRouteSubmit = (routeData: Omit<Route, 'id'>) => {
    addRoute(routeData);
    setShowRouteForm(false);
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setShowRouteForm(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className={className}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
        {showRouteForm ? (
          <>
            <DialogHeader className="mb-4">
              <DialogTitle>Add Your First Route</DialogTitle>
              <DialogDescription>
                Add details about your regular route to get personalized air quality insights.
              </DialogDescription>
            </DialogHeader>
            <RouteForm
              onSubmit={handleRouteSubmit}
              onCancel={() => setIsOpen(false)}
            />
          </>
        ) : (
          <>
            <DialogHeader className="mb-4">
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>
                Manage your profile, routes, and preferences
              </DialogDescription>
            </DialogHeader>
            <ProfilePage />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}