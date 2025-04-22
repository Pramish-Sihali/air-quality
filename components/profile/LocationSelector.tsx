// @typescript-eslint/no-unused-vars
'use client';

import React, { useState } from 'react';
import {ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { kathmandu_locations } from '@/types/routes';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function LocationSelector({
  value,
  onChange,
  label,
  placeholder = "Select a location",
  className,
}: LocationSelectorProps) {
  const [open, setOpen] = useState(false);

  // Sort locations alphabetically for easier selection
  const sortedLocations = [...kathmandu_locations].sort((a, b) => 
    a.location.localeCompare(b.location)
  );

  // Find the AQI color for a location based on PM2.5 values
  // const getLocationColor = (pm25: number) => {
  //   if (pm25 <= 12) return 'bg-green-100 text-green-800';
  //   if (pm25 <= 35.4) return 'bg-yellow-100 text-yellow-800';
  //   if (pm25 <= 55.4) return 'bg-orange-100 text-orange-800';
  //   if (pm25 <= 150.4) return 'bg-red-100 text-red-800';
  //   if (pm25 <= 250.4) return 'bg-purple-100 text-purple-800';
  //   return 'bg-rose-100 text-rose-800';
  // };

  return (
    <div className={className}>
      {label && <Label className="mb-1">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? sortedLocations.find((location) => location.location === value)?.location
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
        <Select value={value} onValueChange={(v) => { onChange(v); setOpen(false); }}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder={placeholder} />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {sortedLocations.map((loc) => (
        <SelectItem key={loc.location} value={loc.location}>
          {loc.location}
        </SelectItem>
      ))}
    </SelectGroup>
  </SelectContent>
</Select>
        </PopoverContent>
      </Popover>
    </div>
  );
}