'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Route, defaultProfile } from '@/types/routes';

interface ProfileContextType {
  profile: UserProfile;
  isLoading: boolean;
  addRoute: (route: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, route: Partial<Route>) => void;
  deleteRoute: (id: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  calculateMostVisitedLocations: () => { location: string; frequency: number }[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save profile to localStorage when it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  }, [profile, isLoading]);

  // Generate a unique ID for new routes
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Add a new route
  const addRoute = (route: Omit<Route, 'id'>) => {
    const newRoute: Route = {
      ...route,
      id: generateId(),
      active: true
    };
    setProfile((prev) => ({
      ...prev,
      routes: [...prev.routes, newRoute]
    }));
  };

  // Update an existing route
  const updateRoute = (id: string, updates: Partial<Route>) => {
    setProfile((prev) => ({
      ...prev,
      routes: prev.routes.map(route => 
        route.id === id ? { ...route, ...updates } : route
      )
    }));
  };

  // Delete a route
  const deleteRoute = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      routes: prev.routes.filter(route => route.id !== id)
    }));
  };

  // Update profile data
  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...data
    }));
  };

  // Calculate most visited locations based on routes
  const calculateMostVisitedLocations = () => {
    const locationFrequency: Record<string, number> = {};
    
    // Only consider active routes
    const activeRoutes = profile.routes.filter(route => route.active);
    
    // Function to compute visit frequency based on route frequency
    const getVisitMultiplier = (frequency: string): number => {
      switch (frequency) {
        case 'daily': return 7;
        case 'weekdays': return 5;
        case 'weekends': return 2;
        case 'occasionally': return 1;
        default: return 1;
      }
    };
    
    // Add home and work locations
    locationFrequency[profile.homeLocation.location] = 7; // Home every day
    if (profile.workLocation) {
      locationFrequency[profile.workLocation.location] = 5; // Work on weekdays
    }
    
    // Process each route
    activeRoutes.forEach(route => {
      const frequencyMultiplier = getVisitMultiplier(route.frequency);
      
      // Add start location
      locationFrequency[route.start.location] = 
        (locationFrequency[route.start.location] || 0) + frequencyMultiplier;
      
      // Add end location
      locationFrequency[route.end.location] = 
        (locationFrequency[route.end.location] || 0) + frequencyMultiplier;
      
      // Add via locations
      route.via?.forEach(viaPoint => {
        locationFrequency[viaPoint.location] = 
          (locationFrequency[viaPoint.location] || 0) + frequencyMultiplier;
      });
    });
    
    // Convert to array and sort by frequency
    return Object.entries(locationFrequency)
      .map(([location, frequency]) => ({ location, frequency }))
      .sort((a, b) => b.frequency - a.frequency);
  };

  const value = {
    profile,
    isLoading,
    addRoute,
    updateRoute,
    deleteRoute,
    updateProfile,
    calculateMostVisitedLocations
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};