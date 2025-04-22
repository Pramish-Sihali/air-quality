'use client';

import React, { useState } from 'react';
import { Plus, Minus, Car, Bus, Bike,  Router } from 'lucide-react';
import { LocationSelector } from './LocationSelector';
import { kathmandu_locations } from '@/types/routes';
import type { TransportMode, Frequency, Route } from '@/types/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RouteFormProps {
  initialData?: Partial<Route>;
  onSubmit: (data: Omit<Route, 'id'>) => void;
  onCancel: () => void;
}

export function RouteForm({ initialData, onSubmit, onCancel }: RouteFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [startLocation, setStartLocation] = useState(initialData?.start?.location || '');
  const [endLocation, setEndLocation] = useState(initialData?.end?.location || '');
  const [frequency, setFrequency] = useState<Frequency>(initialData?.frequency || 'weekdays');
  const [transportMode, setTransportMode] = useState<TransportMode>(initialData?.transportMode || 'public_transport');
  const [departureTime, setDepartureTime] = useState(initialData?.departureTime || '08:00');
  const [returnTime, setReturnTime] = useState(initialData?.returnTime || '18:00');
  const [viaPoints, setViaPoints] = useState<string[]>(
    initialData?.via?.map(v => v.location) || []
  );

  const getCoordinatesForLocation = (locationName: string): { lat: number; lng: number } => {
    const location = kathmandu_locations.find(loc => loc.location === locationName);
    return location?.coordinates || { lat: 0, lng: 0 };
  };

  const handleAddViaPoint = () => {
    setViaPoints([...viaPoints, '']);
  };

  const handleRemoveViaPoint = (index: number) => {
    setViaPoints(viaPoints.filter((_, i) => i !== index));
  };

  const handleUpdateViaPoint = (index: number, value: string) => {
    const newViaPoints = [...viaPoints];
    newViaPoints[index] = value;
    setViaPoints(newViaPoints);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name || !startLocation || !endLocation) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Create route object
    const route: Omit<Route, 'id'> = {
      name,
      start: {
        location: startLocation,
        coordinates: getCoordinatesForLocation(startLocation)
      },
      end: {
        location: endLocation,
        coordinates: getCoordinatesForLocation(endLocation)
      },
      via: viaPoints
        .filter(location => location) // Remove empty locations
        .map(location => ({
          location,
          coordinates: getCoordinatesForLocation(location)
        })),
      frequency,
      departureTime,
      returnTime,
      transportMode,
      active: initialData?.active !== undefined ? initialData.active : true
    };
    
    onSubmit(route);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Route Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Home to Office"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LocationSelector
            label="Start Location"
            value={startLocation}
            onChange={setStartLocation}
            placeholder="Select starting point"
          />
          
          <LocationSelector
            label="End Location"
            value={endLocation}
            onChange={setEndLocation}
            placeholder="Select destination"
          />
        </div>
        
        {viaPoints.map((viaPoint, index) => (
          <div key={index} className="flex items-end gap-2">
            <LocationSelector
              label={index === 0 ? "Via (Optional)" : undefined}
              value={viaPoint}
              onChange={(value) => handleUpdateViaPoint(index, value)}
              placeholder="Select via point"
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={() => handleRemoveViaPoint(index)}
              className="mb-0.5"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddViaPoint}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Via Point
        </Button>
        
        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Select value={frequency} onValueChange={(value) => setFrequency(value as Frequency)}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekdays">Weekdays</SelectItem>
              <SelectItem value="weekends">Weekends</SelectItem>
              <SelectItem value="occasionally">Occasionally</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="departureTime">Departure Time</Label>
            <Input
              id="departureTime"
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="returnTime">Return Time</Label>
            <Input
              id="returnTime"
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label>Transport Mode</Label>
          <RadioGroup 
            value={transportMode} 
            onValueChange={(value: string) => setTransportMode(value as TransportMode)}
            className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2"
          >
            <Label 
              htmlFor="public_transport" 
              className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                transportMode === 'public_transport' ? 'bg-primary/10 border-primary' : ''
              } hover:bg-accent cursor-pointer`}
            >
              <RadioGroupItem value="public_transport" id="public_transport" className="sr-only" />
              <Bus className="h-5 w-5 mb-1" />
              <span className="text-xs">Public</span>
            </Label>
            
            <Label 
              htmlFor="car" 
              className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                transportMode === 'car' ? 'bg-primary/10 border-primary' : ''
              } hover:bg-accent cursor-pointer`}
            >
              <RadioGroupItem value="car" id="car" className="sr-only" />
              <Car className="h-5 w-5 mb-1" />
              <span className="text-xs">Car</span>
            </Label>
            
            <Label 
              htmlFor="cycling" 
              className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                transportMode === 'cycling' ? 'bg-primary/10 border-primary' : ''
              } hover:bg-accent cursor-pointer`}
            >
              <RadioGroupItem value="cycling" id="cycling" className="sr-only" />
              <Bike className="h-5 w-5 mb-1" />
              <span className="text-xs">Cycling</span>
            </Label>
            
            <Label 
              htmlFor="walking" 
              className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                transportMode === 'walking' ? 'bg-primary/10 border-primary' : ''
              } hover:bg-accent cursor-pointer`}
            >
              <RadioGroupItem value="walking" id="walking" className="sr-only" />
              {/* <Walking className="h-5 w-5 mb-1" /> */}
              <span className="text-xs">Walking</span>
            </Label>
            
            <Label 
              htmlFor="other" 
              className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                transportMode === 'other' ? 'bg-primary/10 border-primary' : ''
              } hover:bg-accent cursor-pointer`}
            >
              <RadioGroupItem value="other" id="other" className="sr-only" />
              <Router className="h-5 w-5 mb-1" />
              <span className="text-xs">Other</span>
            </Label>
          </RadioGroup>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData?.id ? 'Update' : 'Add'} Route
        </Button>
      </div>
    </form>
  );
}