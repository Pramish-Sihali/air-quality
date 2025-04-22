// @typescript-eslint/no-unused-vars
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,  ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useProfile } from '@/contexts/ProfileContext';
import { kathmandu_locations } from '@/types/routes';
import { MapPin, Clock, AlertTriangle, Zap } from 'lucide-react';

// Mock data - in a real app, this would come from API calls
const MOCK_DAILY_EXPOSURE = [
  { time: '6am', value: 15, location: 'Home' },
  { time: '8am', value: 85, location: 'Commuting' },
  { time: '10am', value: 60, location: 'Office' },
  { time: '12pm', value: 45, location: 'Office' },
  { time: '2pm', value: 30, location: 'Office' },
  { time: '4pm', value: 55, location: 'Office' },
  { time: '6pm', value: 95, location: 'Commuting' },
  { time: '8pm', value: 40, location: 'Home' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function PersonalizedExposureAnalysis() {
  const { profile, calculateMostVisitedLocations } = useProfile();
  const [locationExposure, setLocationExposure] = useState<Array<{name: string; value: number; fill: string}>>([]);
  const [routeRecommendations, setRouteRecommendations] = useState<Array<{route: string; reduction: number}>>([]);

  useEffect(() => {
    if (profile.routes.length > 0) {
      // Get the most visited locations
      const mostVisited = calculateMostVisitedLocations();
      
      // Calculate exposure for each location
      const exposureData = mostVisited.slice(0, 6).map((location, index) => {
        // Find PM2.5 data for this location
        const locationData = kathmandu_locations.find(loc => loc.location === location.location);
        return {
          name: location.location,
          value: locationData?.pm25_avg || 50, // Default value if not found
          fill: COLORS[index % COLORS.length]
        };
      });
      
      setLocationExposure(exposureData);
      
      // Generate route recommendations based on alternative routes with lower exposure
      // This would normally be calculated based on actual data
      const recommendations = [
        { route: "Home to Office", reduction: 35 },
        { route: "Office to Gym", reduction: 22 },
        { route: "Weekend shopping", reduction: 15 }
      ];
      
      setRouteRecommendations(recommendations);
    }
  }, [profile.routes, calculateMostVisitedLocations]);

  // Check if we have enough data to show personalized analysis
  const hasEnoughData = profile.routes.length > 0;

  if (!hasEnoughData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personalized Exposure Analysis</CardTitle>
          <CardDescription>
            Add your regular routes in your profile to see personalized air quality exposure analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">
            Your personalized exposure analysis will appear here once you&apos;ve added routes to your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Personal Exposure Analysis</CardTitle>
        <CardDescription>
          Based on your routes and frequently visited locations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Daily Exposure Pattern</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={MOCK_DAILY_EXPOSURE}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis label={{ value: 'PM2.5 (μg/m³)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value) => [
                      `${value} μg/m³`, 
                      'PM2.5'
                    ]}
                    labelFormatter={(label) => `Time: ${label}`}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background p-2 border rounded shadow-sm">
                            <p className="text-xs font-medium">{label}</p>
                            <p className="text-xs text-primary">
                              {payload[0].payload.location} - {payload[0].value} μg/m³
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                    name="PM2.5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Exposure by Location</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationExposure}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {locationExposure.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} μg/m³`, 'PM2.5']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Route Optimization Recommendations</h3>
          <div className="space-y-3">
            {routeRecommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Change route: {rec.route}</span>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                  Reduces exposure by {rec.reduction}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Exposure Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1 rounded">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Highest exposure location</p>
                <p className="text-sm text-muted-foreground">
                  {locationExposure[0]?.name || 'Loading...'} 
                  ({locationExposure[0]?.value || 0} μg/m³)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1 rounded">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Peak exposure time</p>
                <p className="text-sm text-muted-foreground">
                  Between 6:00 PM - 7:00 PM during commute
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1 rounded">
                <AlertTriangle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Health impact assessment</p>
                <p className="text-sm text-muted-foreground">
                  Your daily exposure is 152% of WHO recommended limit
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}