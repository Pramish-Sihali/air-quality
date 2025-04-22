'use client';

import React from 'react';
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
import { ProfileProvider } from '@/contexts/ProfileContext';

interface ProfileDialogProps {
  trigger?: React.ReactNode;
  className?: string;
}

export function ProfileDialog({ trigger, className }: ProfileDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className={className}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Manage your profile, routes, and preferences
          </DialogDescription>
        </DialogHeader>
        <ProfileProvider>
          <ProfilePage />
        </ProfileProvider>
      </DialogContent>
    </Dialog>
  );
}