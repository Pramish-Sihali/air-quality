'use client';

import React from 'react';
import { Edit, Trash2, Car, Bus, Bike, Router, MapPin, Calendar } from 'lucide-react';
import { Route } from '@/types/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/contexts/ProfileContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface RouteListProps {
  onEditRoute: (route: Route) => void;
}

export function RouteList({ onEditRoute }: RouteListProps) {
  const { profile, deleteRoute, updateRoute } = useProfile();
  
  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'car': return <Car className="h-4 w-4" />;
      case 'public_transport': return <Bus className="h-4 w-4" />;
      case 'cycling': return <Bike className="h-4 w-4" />;
    //   case 'walking': return <Walking className="h-4 w-4" />;
      default: return <Router className="h-4 w-4" />;
    }
  };
  
  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Every day';
      case 'weekdays': return 'Weekdays';
      case 'weekends': return 'Weekends';
      case 'occasionally': return 'Occasionally';
      default: return frequency;
    }
  };
  
  // Function to get color based on PM2.5 levels
  const getAqiColor = (value: number) => {
    if (value <= 12) return 'bg-green-100 text-green-800';
    if (value <= 35.4) return 'bg-yellow-100 text-yellow-800';
    if (value <= 55.4) return 'bg-orange-100 text-orange-800';
    if (value <= 150.4) return 'bg-red-100 text-red-800';
    if (value <= 250.4) return 'bg-purple-100 text-purple-800';
    return 'bg-rose-100 text-rose-800';
  };
  
  // Get PM2.5 value for a location from the types/routes.ts data
  const getPM25ForLocation = (location: string): number => {
    const locationData = profile.routes.find(r => 
      r.start.location === location || 
      r.end.location === location || 
      r.via?.some(v => v.location === location)
    );
    
    // This would be replaced with actual data from your API/database
    return locationData ? 75 : 50; // Default value
  };
  
  const toggleRouteActive = (id: string, active: boolean) => {
    updateRoute(id, { active });
  };

  if (profile.routes.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No routes added yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Add your regular commutes to get personalized air quality insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {profile.routes.map((route) => (
        <Card key={route.id} className={!route.active ? 'opacity-70' : ''}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-lg font-semibold">{route.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{getFrequencyLabel(route.frequency)}</span>
                <span>•</span>
                {getTransportIcon(route.transportMode)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={route.active} 
                onCheckedChange={(checked) => toggleRouteActive(route.id, checked)}
                id={`route-active-${route.id}`}
              />
              <Label htmlFor={`route-active-${route.id}`} className="text-xs">
                {route.active ? 'Active' : 'Inactive'}
              </Label>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
              <div className="flex items-center text-emerald-600">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <span>{route.start.location}</span>
                <Badge variant="outline" className={getAqiColor(getPM25ForLocation(route.start.location))}>
                  PM2.5: {getPM25ForLocation(route.start.location)}
                </Badge>
              </div>
              
              {route.via && route.via.map((via, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center justify-center text-gray-400">
                    <div className="h-4 w-4 flex items-center justify-center">↓</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{via.location}</span>
                    <Badge variant="outline" className={getAqiColor(getPM25ForLocation(via.location))}>
                      PM2.5: {getPM25ForLocation(via.location)}
                    </Badge>
                  </div>
                </React.Fragment>
              ))}
              
              <div className="flex items-center justify-center text-gray-400">
                <div className="h-4 w-4 flex items-center justify-center">↓</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-600">{route.end.location}</span>
                <Badge variant="outline" className={getAqiColor(getPM25ForLocation(route.end.location))}>
                  PM2.5: {getPM25ForLocation(route.end.location)}
                </Badge>
              </div>
            </div>
            
            {route.departureTime && route.returnTime && (
              <div className="mt-2 text-xs text-muted-foreground">
                Departure: {route.departureTime} &nbsp;•&nbsp; Return: {route.returnTime}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onEditRoute(route)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteRoute(route.id)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}