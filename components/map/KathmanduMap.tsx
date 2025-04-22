'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, Search } from 'lucide-react';
import { kathmandu_locations, personalExposurePoints } from '@/data/monitoring-data';
import { getAqiColorHex } from '@/data/constants';

// Component for Kathmandu Map 
export function KathmanduMap() {
  // In a real implementation, you would use a mapping library like Leaflet or Google Maps
  // This is a placeholder visualization using SVG
  return (
    <div className="relative h-[500px] bg-slate-100 rounded-md overflow-hidden">
      {/* SVG Map of Kathmandu (simplified) */}
      <svg viewBox="0 0 500 400" className="absolute inset-0 w-full h-full">
        {/* Base map - simplified outline of Kathmandu valley */}
        <path d="M100,100 C150,50 350,50 400,100 C450,150 450,250 400,300 C350,350 150,350 100,300 C50,250 50,150 100,100 Z" 
          fill="#f0f0f0" stroke="#cccccc" strokeWidth="2" />
        
        {/* Main rivers - simplified Bagmati and tributaries */}
        <path d="M150,80 C180,150 200,200 250,300 C280,320 300,350 350,370" 
          fill="none" stroke="#92c4de" strokeWidth="3" />
        <path d="M180,100 C200,180 220,250 260,320" 
          fill="none" stroke="#92c4de" strokeWidth="2" />
          
        {/* Ring Road - simplified */}
        <ellipse cx="250" cy="200" rx="120" ry="100" 
          fill="none" stroke="#999999" strokeWidth="2" strokeDasharray="5,3" />
          
        {/* Place AQI markers - visualizing monitoring stations */}
        {kathmandu_locations.map((loc, index) => (
          <g key={`marker-group-${index}`}>
            <circle 
              key={`marker-${index}`}
              cx={100 + (loc.lng - 85.25) * 800} 
              cy={350 - (loc.lat - 27.65) * 800}
              r={loc.aqi / 20 + 5}
              fill={getAqiColorHex(loc.aqi)}
              fillOpacity="0.7"
              stroke="#ffffff"
              strokeWidth="1"
            />
            <text
              key={`text-${index}`}
              x={100 + (loc.lng - 85.25) * 800}
              y={350 - (loc.lat - 27.65) * 800 + 4}
              fontSize="8"
              textAnchor="middle"
              fill="#333333"
              fontWeight="bold"
            >
              {loc.name.substring(0, 3)}
            </text>
          </g>
        ))}
        
        {/* Personal exposure route - visualizing daily travel */}
        <polyline 
          points={personalExposurePoints.map(point => 
            `${100 + (point.lng - 85.25) * 800},${350 - (point.lat - 27.65) * 800}`
          ).join(' ')}
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1,1"
        />
        
        {/* Current location indicator */}
        <circle
          cx={100 + (personalExposurePoints[5].lng - 85.25) * 800}
          cy={350 - (personalExposurePoints[5].lat - 27.65) * 800}
          r="6"
          fill="#3b82f6"
          stroke="#ffffff"
          strokeWidth="2"
        >
          <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
      
      {/* Map overlay with legend */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-md shadow-md">
        <h4 className="text-sm font-bold mb-2">Air Quality Index</h4>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs">Good (0-50)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
            <span className="text-xs">Moderate (51-100)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-orange-400 mr-2"></div>
            <span className="text-xs">Unhealthy for Sensitive Groups (101-150)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs">Unhealthy (151-200)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-xs">Very Unhealthy (201-300)</span>
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button size="sm" variant="outline" className="bg-white bg-opacity-90">
          <Layers className="h-4 w-4 mr-2" />
          Toggle Layers
        </Button>
        <Button size="sm" variant="outline" className="bg-white bg-opacity-90">
          <Search className="h-4 w-4 mr-2" />
          Find Location
        </Button>
      </div>
    </div>
  );
}