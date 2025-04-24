// app/page.tsx
//@typescript-eslint/no-explicit-any

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Import data constants and utils
import { getAqiColor, COLORS } from '@/data/constants';

// Import our custom components
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext'
import { RouteForm } from '@/components/profile/RouteForm';
import { AqiLevel, WeatherData, RouteWithAlternatives, HourlyExposure, LocationExposure } from '@/types/air-quality';

import { Route } from '@/types/routes';

// Import icons from lucide-react
import {
  MapPin,
  Wind,
  Clock,
  ChevronDown,

  BarChart3,
  User,
  Settings,
  RefreshCw,
  Thermometer,
  Droplets,
  Zap,

  ArrowDown,
  ArrowUp,
  AlertTriangle,
  Info,
  
} from 'lucide-react'

// AQI Level Explanation Component
const AqiLevelExplanation: React.FC<{ levels: AqiLevel[] }> = ({ levels }) => {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium">Understanding Air Quality Index (AQI) Levels</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {levels.map((level: AqiLevel, index: number) => (
          <Card key={index} className="overflow-hidden border-t-4" style={{ borderTopColor: level.color }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{level.level}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="mb-2">{level.description}</p>
              <p className="text-xs text-muted-foreground">
                <strong>Health implications:</strong> {level.health_implications}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Route Optimization Component with Detailed Analysis
const RouteOptimization: React.FC<{ 
  routeData: RouteWithAlternatives[] | undefined; 
  onRefresh: () => void;
}> = ({ routeData, onRefresh }) => {
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);

  if (!routeData || routeData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Route Optimization</CardTitle>
          <CardDescription>
            Analyze your routes for lower pollution exposure
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">No route data available</p>
          <Button onClick={onRefresh} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Route Optimization</CardTitle>
          <CardDescription>
            Analyze your routes for lower pollution exposure
          </CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {routeData.map((route, routeIndex) => (
          <Collapsible 
            key={routeIndex}
            open={expandedRoute === route.base_route.id}
            onOpenChange={(open) => setExpandedRoute(open ? route.base_route.id : null)}
            className="border rounded-lg"
          >
            <div className="p-4 border-b bg-slate-50">
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-blue-500 mr-2" />
                  <div className="text-left">
                    <h3 className="text-sm font-medium">{route.base_route.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {route.base_route.start} → {route.base_route.end} ({route.base_route.distance_km} km)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {route.base_route.avg_pm25} μg/m³
                  </Badge>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent>
              <div className="p-4 space-y-4">
                <div className="rounded-md bg-blue-50 p-3">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Current Route Analysis</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-blue-700">Avg. PM2.5:</div>
                    <div className="font-medium text-blue-900">{route.base_route.avg_pm25} μg/m³</div>
                    <div className="text-blue-700">Avg. PM10:</div>
                    <div className="font-medium text-blue-900">{route.base_route.avg_pm10} μg/m³</div>
                    <div className="text-blue-700">Travel Time:</div>
                    <div className="font-medium text-blue-900">{route.base_route.exposure_time_mins} mins</div>
                    <div className="text-blue-700">Total Exposure:</div>
                    <div className="font-medium text-blue-900">{route.base_route.total_exposure} units</div>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium pt-2">Optimization Alternatives</h4>
                
                {route.alternatives.map((alt, index) => (
                  <div key={index} className="border rounded-md p-3 hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium">{alt.name}</h5>
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                        {alt.reduction_percent}% Less Exposure
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div className="text-muted-foreground">New PM2.5:</div>
                      <div className="font-medium">{alt.avg_pm25} μg/m³</div>
                      
                      <div className="text-muted-foreground">Distance:</div>
                      <div className="font-medium">{alt.distance_km} km</div>
                      
                      <div className="text-muted-foreground">Travel Time:</div>
                      <div className="font-medium">{alt.exposure_time_mins} mins</div>
                      
                      <div className="text-muted-foreground">Extra Time:</div>
                      <div className="font-medium">{alt.extra_time_mins > 0 ? `+${alt.extra_time_mins} mins` : 'No extra time'}</div>
                    </div>
                    
                    <div className="mt-3 flex items-center">
                      <Progress
                        value={100 - alt.reduction_percent}
                        className="h-2 flex-1"
                      />
                      <span className="text-xs text-muted-foreground ml-2 w-20">
                        {alt.exposure_reduction} units less
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <Button size="sm" variant="outline" className="w-full">
                        Apply This Route
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <Info className="h-3 w-3 mr-1" /> 
        Routes optimized based on real-time air quality data. Total exposure is calculated based on pollution level and time spent on route.
      </CardFooter>
    </Card>
  );
};

// Weather Impact Component with Detailed Analysis
const WeatherImpact: React.FC<{ 
  weatherData: WeatherData | null; 
  onRefresh: () => void;
}> = ({ weatherData, onRefresh }) => {

  if (!weatherData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Impact Analysis</CardTitle>
          <CardDescription>
            How weather affects air quality
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">No weather data available</p>
          <Button onClick={onRefresh} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Weather Impact Analysis</CardTitle>
            <CardDescription>
              How weather affects air quality
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
              <Thermometer className="h-8 w-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{weatherData.current_weather.temperature}°C</div>
              <div className="text-xs text-center text-muted-foreground">Temperature</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
              <Droplets className="h-8 w-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{weatherData.current_weather.humidity}%</div>
              <div className="text-xs text-center text-muted-foreground">Humidity</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
              <Wind className="h-8 w-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{weatherData.current_weather.wind_speed} km/h</div>
              <div className="text-xs text-center text-muted-foreground">Wind Speed</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold">{weatherData.current_weather.pressure}</div>
              <div className="text-xs text-center text-muted-foreground">Pressure (hPa)</div>
            </div>
          </div>
          
          <h3 className="text-sm font-medium mb-3">Weather-Pollution Correlation</h3>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Correlation</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weatherData.correlations.map((corr, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{corr.parameter}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span 
                          className={corr.correlation > 0 ? "text-red-500" : "text-green-500"}
                        >
                          {corr.correlation > 0 ? <ArrowUp className="h-4 w-4 mr-1 inline" /> : <ArrowDown className="h-4 w-4 mr-1 inline" />}
                          {Math.abs(corr.correlation).toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{corr.impact_level}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hourly Forecast</CardTitle>
            <CardDescription>Today&lsquo;s weather and AQI forecast</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weatherData.hourly_forecast}
                  margin={{ top: 10, right: 30, bottom: 50, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottom', offset: -10 }} />
                  <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 150]} label={{ value: 'AQI', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature" />
                  <Line yAxisId="right" type="monotone" dataKey="aqi_forecast" stroke="#8884d8" name="AQI Forecast" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Patterns</CardTitle>
            <CardDescription>Annual weather and pollution trends</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weatherData.seasonal_patterns}
                  margin={{ top: 10, right: 30, bottom: 50, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 200]} label={{ value: 'Avg AQI', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="avg_temp" stroke="#ff7300" name="Avg Temperature" />
                  <Line yAxisId="right" type="monotone" dataKey="avg_aqi" stroke="#8884d8" name="Avg AQI" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <AqiLevelExplanation levels={weatherData.aqi_levels_explanation} />
    </div>
  );
};

// Initial Setup Form Component
function InitialSetupForm({ onComplete }: { onComplete: () => void }) {
  const { addRoute } = useProfile();
  
  const handleRouteSubmit = (routeData: Omit<Route, 'id'>) => {
    addRoute(routeData);
    onComplete();
  };
  
  const handleSkip = () => {
    onComplete();
  };
  
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Welcome to NepalAir</DialogTitle>
          <DialogDescription>
            Let&lsquo;s set up your first route to get personalized air quality insights.
          </DialogDescription>
        </DialogHeader>
        <RouteForm
          onSubmit={handleRouteSubmit}
          onCancel={handleSkip}
        />
        <div className="mt-4 text-center">
          <Button variant="link" onClick={handleSkip}>
            Skip for now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Personal Exposure Analysis Component with Refresh Button
function PersonalExposureAnalysisSection({ 
  hourlyData, 
  locationData, 
  onRefresh 
}: { 
  hourlyData: HourlyExposure[] | undefined; 
  locationData: LocationExposure[] | undefined; 
  onRefresh: () => void;
}) {  
  if (!hourlyData || !locationData) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Personal Exposure Analysis</CardTitle>
            <CardDescription>Your daily exposure patterns</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">No exposure data available</p>
        </CardContent>
      </Card>
    );
  }

  // Fix Error 1: Initialize with an object that has all the expected properties
  const getMaxHourlyExposure = () => {
    if (hourlyData.length === 0) return { time: "N/A", value: 0, temperature: 0 };
    return hourlyData.reduce(
      (max, hour) => hour.value > max.value ? hour : max, 
      hourlyData[0] // Use the first item as initial value instead of { value: 0 }
    );
  };

  // Fix Error 2: Initialize with an object that has all the expected properties
  const getMaxLocationExposure = () => {
    if (locationData.length === 0) return { name: "N/A", value: 0 };
    return locationData.reduce(
      (max, loc) => loc.value > max.value ? loc : max, 
      locationData[0] // Use the first item as initial value
    );
  };

  const maxHourlyExposure = getMaxHourlyExposure();
  const maxLocationExposure = getMaxLocationExposure();
  const avgExposure = hourlyData.length ? 
    Math.round(hourlyData.reduce((sum, hour) => sum + hour.value, 0) / hourlyData.length) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Personal Exposure Analysis</CardTitle>
          <CardDescription>Your daily exposure patterns</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium mb-3">Daily Exposure Pattern</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={hourlyData}
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
                              {payload[0].value} μg/m³
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Temp: {payload[0].payload.temperature}°C
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    fill="#8884d8"
                    fillOpacity={0.3}
                    name="PM2.5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Exposure by Location</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {locationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        
        <div className="pt-4 border-t mt-4">
          <h3 className="text-sm font-medium mb-3">Key Insights</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="flex flex-col p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-muted-foreground">Highest Exposure Time</div>
              <div className="text-base font-medium mt-1">
                {maxHourlyExposure.time}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {maxHourlyExposure.value} μg/m³
              </div>
            </div>
            
            <div className="flex flex-col p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-muted-foreground">Highest Exposure Location</div>
              <div className="text-base font-medium mt-1">
                {maxLocationExposure.name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {maxLocationExposure.value} μg/m³
              </div>
            </div>
            
            <div className="flex flex-col p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-muted-foreground">Daily Average Exposure</div>
              <div className="text-base font-medium mt-1">
                {avgExposure} μg/m³
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round(avgExposure / 25 * 100)}% of WHO guideline
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Component Wrapper
function DashboardContent() {
  // State for real-time data
  const [currentAqi, setCurrentAqi] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [weeklyData, setWeeklyData] = useState<[]>([]);
  const [locationData, setLocationData] = useState<LocationExposure[]>([]);
  const [hourlyExposureData, setHourlyExposureData] = useState<HourlyExposure[]>([]);
  const [routeOptimizationData, setRouteOptimizationData] = useState<RouteWithAlternatives[]>([]);
  const [detailedWeatherData, setDetailedWeatherData] = useState<WeatherData | null>(null);
  
  // UI State
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<string | null>(null); // Fix Error 3: Change type to string | null
  const [showSetupForm, setShowSetupForm] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const { profile } = useProfile();
  
  // Check if user should see setup form
  useEffect(() => {
    // Only show setup form if it's the first visit and user has no routes
    const hasCompletedSetup = localStorage.getItem('hasCompletedSetup');
    setShowSetupForm(!hasCompletedSetup && profile.routes.length === 0);
    
    // On first load, fetch initial data
    if (!dataLoaded) {
      fetchApiData(true);
    }
  }, [profile.routes.length, dataLoaded]);
  
  // Complete setup
  const completeSetup = () => {
    localStorage.setItem('hasCompletedSetup', 'true');
    setShowSetupForm(false);
  };
  
  // Function to fetch API data
  const fetchApiData = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      // Don't show loading state for initial load to avoid flashing
      setDataLoaded(true);
    } else {
      setIsFetchingData(true);
    }
    
    try {
      // Start with mock data for immediate development
      const useMock = true; // Set to false in production
      
      const response = await fetch(`/api/fast-air-quality?mock=${useMock}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch air quality data');
      }
      
      const result = await response.json();
      setLastFetchTime(new Date().toLocaleTimeString());
      
      // Update your state with the new data
      if (result.data) {
        // Update current AQI
        if (result.data.current_aqi) {
          setCurrentAqi(result.data.current_aqi.aqi);
          
          // Update exposure if available
          if (result.data.current_aqi.pollutants && result.data.current_aqi.pollutants.pm25) {
            setExposure(result.data.current_aqi.pollutants.pm25);
          }
        }
        
        // Update weekly trend data
        if (result.data.weekly_trend) {
          setWeeklyData(result.data.weekly_trend);
        }
        
        // Update location data
        if (result.data.locations) {
          setLocationData(result.data.locations);
        }
        
        // Update hourly exposure data
        if (result.data.hourly_exposure) {
          setHourlyExposureData(result.data.hourly_exposure);
        }
        
        // Update route optimization data
        if (result.data.route_optimization) {
          setRouteOptimizationData(result.data.route_optimization);
        }
        
        // Update detailed weather data
        if (result.data.detailed_weather) {
          setDetailedWeatherData(result.data.detailed_weather);
        }
        
        // Log the fetch time for performance monitoring
        console.log(`Data fetched in ${result.fetchTime} seconds`);
      }
      
      if (!isInitialLoad) {
        alert(`Successfully fetched latest air quality data in ${result.fetchTime} seconds!`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (!isInitialLoad) {
        alert('Error fetching data. Please try again or use mock data.');
      }
    } finally {
      setIsFetchingData(false);
    }
  };
  
  // Fix Error 4, 5, 6: Fix getHighestExposureLocation function to handle empty data
  const getHighestExposureLocation = (): { name: string; value: number } => {
    if (!locationData || locationData.length === 0) {
      return { name: "Unknown", value: 0 };
    }
    return locationData.reduce((max, loc) => loc.value > max.value ? loc : max, locationData[0]);
  };
  
  // If setup form should be shown, render it
  if (showSetupForm) {
    return <InitialSetupForm onComplete={completeSetup} />;
  }

  const highestExposureLocation = getHighestExposureLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Wind className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold hidden md:inline-block">NepalAir: Personal Exposure Monitor</h1>
          <h1 className="text-xl font-semibold md:hidden">NepalAir</h1>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          {/* Fetch Data Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchApiData()}
            disabled={isFetchingData}
          >
            {isFetchingData ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Fetching...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </>
            )}
          </Button>
          {lastFetchTime && (
            <span className="text-xs text-muted-foreground hidden md:inline">
              Last updated: {lastFetchTime}
            </span>
          )}
          
          {/* Profile Button - Shows user's settings */}
          <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-6 bg-gray-50">
        {/* Current Air Quality Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current AQI</CardTitle>
              <CardDescription>Kathmandu Valley</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold">{currentAqi}</div>
                <Badge className={getAqiColor(currentAqi)}>
                  {currentAqi <= 50 ? "Good" : 
                   currentAqi <= 100 ? "Moderate" : 
                   currentAqi <= 150 ? "Unhealthy for Sensitive Groups" : 
                   currentAqi <= 200 ? "Unhealthy" : 
                   currentAqi <= 300 ? "Very Unhealthy" : "Hazardous"}
                </Badge>
                <div className="mt-2 text-xs text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3 inline" />
                  Last updated {lastFetchTime || "recently"}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Your Daily Exposure</CardTitle>
              <CardDescription>Compared to WHO Guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-4xl font-bold">{exposure} μg/m³</div>
                <div className="mt-2">
                  <Progress value={Math.min(100, exposure / 25 * 100)} className="h-2" />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {Math.round(exposure / 25 * 100)}% of WHO recommended limit (25 μg/m³)
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Highest Exposure</CardTitle>
              <CardDescription>Today&apos;s hotspot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-4xl font-bold">{highestExposureLocation.name}</div>
                <Badge variant="outline" className="mt-1 w-fit">
                  <Clock className="mr-1 h-3 w-3" />
                  Peak Hours
                </Badge>
                <div className="mt-2 text-xs text-muted-foreground">
                  {highestExposureLocation.value} μg/m³
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="dashboard" className="mt-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="dashboard">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="route-optimization">
              <Zap className="mr-2 h-4 w-4" />
              Route Optimization
            </TabsTrigger>
            <TabsTrigger value="weather">
              <Thermometer className="mr-2 h-4 w-4" />
              Weather Factors
            </TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Weekly Trends</CardTitle>
                    <CardDescription>
                      PM2.5 and PM10 levels over the past week
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => fetchApiData()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={weeklyData}
                        margin={{ top: 10, right: 30, bottom: 50, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" label={{ value: 'Day of Week', position: 'insideBottom', offset: -10 }} />
                        <YAxis label={{ value: 'Concentration (μg/m³)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
                        <Line type="monotone" dataKey="PM25" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} name="PM2.5" />
                        <Line type="monotone" dataKey="PM10" stroke="#82ca9d" strokeWidth={2} name="PM10" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Exposure by Location</CardTitle>
                    <CardDescription>
                      Where you experience pollution
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => fetchApiData()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={locationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {locationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} μg/m³`, 'Exposure']} />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personalized exposure analysis component */}
            <PersonalExposureAnalysisSection 
              hourlyData={hourlyExposureData} 
              locationData={locationData}
              onRefresh={() => fetchApiData()} 
            />
          </TabsContent>
          
          {/* Route Optimization Tab */}
          <TabsContent value="route-optimization" className="space-y-4">
            <RouteOptimization 
              routeData={routeOptimizationData} 
              onRefresh={() => fetchApiData()} 
            />
          </TabsContent>
          
          {/* Weather Factors Tab */}
          <TabsContent value="weather" className="space-y-4">
            <WeatherImpact 
              weatherData={detailedWeatherData} 
              onRefresh={() => fetchApiData()}
            />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t bg-background p-4 text-center text-sm text-muted-foreground">
        NepalAir Personal Exposure Monitor — Helping you breathe easier © 2023
      </footer>
    </div>
  );
}

// Main Dashboard Export
export default function Dashboard() {
  return (
    <ProfileProvider>
      <DashboardContent />
    </ProfileProvider>
  );
}