'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RouteForm } from './RouteForm';
import { RouteList } from './RouteList';
import { Route, HealthSensitivity } from '@/types/routes';
import { useProfile } from '@/contexts/ProfileContext';
import { LocationSelector } from './LocationSelector';
import { Home, Briefcase, PlusCircle, AlertTriangle, Bell, Users, MapPin } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ProfilePage() {
  const { profile, updateProfile, addRoute, updateRoute } = useProfile();
  const [activeTab, setActiveTab] = useState('routes');
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [addingRoute, setAddingRoute] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email || '');
  const [homeLocation, setHomeLocation] = useState(profile.homeLocation.location);
  const [workLocation, setWorkLocation] = useState(profile.workLocation?.location || '');
  const [healthSensitivity, setHealthSensitivity] = useState<HealthSensitivity>(
    profile.healthSensitivity || 'medium'
  );
  const [emailNotifications, setEmailNotifications] = useState(profile.notificationPreferences.email);
  const [pushNotifications, setPushNotifications] = useState(profile.notificationPreferences.push);
  const [thresholdAQI, setThresholdAQI] = useState(profile.notificationPreferences.thresholdAQI);

  const handleSaveProfile = () => {
    updateProfile({
      name,
      email: email || undefined,
      homeLocation: {
        location: homeLocation,
        coordinates: { lat: 0, lng: 0 }, // This would be looked up from a location service
      },
      workLocation: workLocation ? {
        location: workLocation,
        coordinates: { lat: 0, lng: 0 }, // This would be looked up from a location service
      } : undefined,
      healthSensitivity,
      notificationPreferences: {
        email: emailNotifications,
        push: pushNotifications,
        thresholdAQI,
      },
    });
    alert('Profile saved successfully!');
  };

  const handleFormSubmit = (routeData: Omit<Route, 'id'>) => {
    if (editingRoute) {
      updateRoute(editingRoute.id, routeData);
      setEditingRoute(null);
    } else {
      addRoute(routeData);
      setAddingRoute(false);
    }
  };

  const handleEditRoute = (route: Route) => {
    setEditingRoute(route);
  };

  const handleCancelRouteEdit = () => {
    setEditingRoute(null);
    setAddingRoute(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and routes</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="routes">
            <MapPin className="mr-2 h-4 w-4" />
            Your Routes
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Users className="mr-2 h-4 w-4" />
            Personal Details
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Routes</h2>
            <Button onClick={() => setAddingRoute(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Route
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Add your regular routes to receive personalized air quality alerts and recommendations.
          </p>

          <RouteList onEditRoute={handleEditRoute} />

          <Dialog open={addingRoute} onOpenChange={setAddingRoute}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Route</DialogTitle>
                <DialogDescription>
                  Add details about your regular route to get personalized air quality insights.
                </DialogDescription>
              </DialogHeader>
              <RouteForm
                onSubmit={handleFormSubmit}
                onCancel={handleCancelRouteEdit}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={!!editingRoute} onOpenChange={(open) => !open && setEditingRoute(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Route</DialogTitle>
                <DialogDescription>
                  Update the details of your route.
                </DialogDescription>
              </DialogHeader>
              {editingRoute && (
                <RouteForm
                  initialData={editingRoute}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCancelRouteEdit}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                />
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Primary Locations</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="homeLocation">Home Location</Label>
                      <LocationSelector
                        value={homeLocation}
                        onChange={setHomeLocation}
                        placeholder="Select your home location"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="workLocation">Work/School Location (Optional)</Label>
                      <LocationSelector
                        value={workLocation}
                        onChange={setWorkLocation}
                        placeholder="Select your work location"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Health Sensitivity</h3>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-3">
                      Select your sensitivity to air pollution. This helps us provide you with more relevant recommendations.
                    </p>
                    <RadioGroup 
                      value={healthSensitivity} 
                      onValueChange={(value) => setHealthSensitivity(value as HealthSensitivity)}
                      className="grid grid-cols-3 gap-2"
                    >
                      <div>
                        <RadioGroupItem value="low" id="sensitivity-low" className="peer sr-only" />
                        <Label
                          htmlFor="sensitivity-low"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="text-sm font-semibold">Low</span>
                          <span className="text-xs text-muted-foreground">Healthy adult</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="medium" id="sensitivity-medium" className="peer sr-only" />
                        <Label
                          htmlFor="sensitivity-medium"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="text-sm font-semibold">Medium</span>
                          <span className="text-xs text-muted-foreground">Some sensitivity</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="high" id="sensitivity-high" className="peer sr-only" />
                        <Label
                          htmlFor="sensitivity-high"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="text-sm font-semibold">High</span>
                          <span className="text-xs text-muted-foreground">Very sensitive</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>Save Profile</Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you want to receive air quality alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive air quality alerts via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts on your device
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex justify-between">
                  <Label htmlFor="aqi-threshold">AQI Alert Threshold</Label>
                  <span className="text-sm font-medium">{thresholdAQI}</span>
                </div>
                <Slider
                  id="aqi-threshold"
                  min={50}
                  max={200}
                  step={5}
                  value={[thresholdAQI]}
                  onValueChange={(values) => setThresholdAQI(values[0])}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low (50)</span>
                  <span>Medium (100)</span>
                  <span>High (150)</span>
                  <span>Severe (200)</span>
                </div>
                <p className="text-sm text-muted-foreground pt-2">
                  You&apos;ll receive notifications when the AQI exceeds {thresholdAQI} in your area or on your routes.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>Save Preferences</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}