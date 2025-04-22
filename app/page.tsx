//@typescript-eslint/no-unused-vars

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// Import data constants and utils
import { getAqiColor, getAqiCategory, getRecommendationColor, getHeatmapCellColor, COLORS } from '@/data/constants';
import { 
  weeklyData, 
  hourlyExposureData, 
  exposureByLocation, 
  heatmapData, 
  monthlyTrendData, 
  weatherTrendData, 
  radarData, 
  airQualityMonitoringStations
} from '@/data/monitoring-data';
import { 
  healthImpactData, 
  recommendations, 
  airQualityNews, 
  recentAlerts 
} from '@/data/recommendations-data';

// Import our custom components
import { ProfileDialog } from '@/components/profile/ProfileDialog'
import { ProfileProvider } from '@/contexts/ProfileContext'
import { PersonalizedExposureAnalysis } from '@/components/dashboard/PersonalizedExposureAnalysis'
import { KathmanduMap } from '@/components/map/KathmanduMap'
import { Lungs,  } from '@/components/icons'
import { AlertItem, } from '@/components/alerts/AlertUtils'

// Import icons from lucide-react
import {
  MapPin,
  AlertTriangle,
  Wind,
  Clock,
  ChevronRight,
  BarChart3,
  Map as MapIcon,
  User,
  Bell,
  Settings,
  HelpCircle,
  Calendar as CalendarIcon,

  FileText,
  Download,
  Share2,
  Layers,
  Thermometer,
  Droplets,
  
  Mail,
  Menu,
  X,
  LogOut,
  UserPlus,

} from 'lucide-react'

export default function Dashboard() {
  const [currentAqi] = useState(156);
  const [exposure] = useState(78);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  
  return (
    <ProfileProvider>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Wind className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold hidden md:inline-block">NepalAir: Personal Exposure Monitor</h1>
            <h1 className="text-xl font-semibold md:hidden">NepalAir</h1>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
              
              </PopoverContent>
            </Popover>
            
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Alerts</span>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {recentAlerts.length}
                </span>
              </Button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium">Recent Alerts</h3>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowNotifications(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="max-h-96">
                    {recentAlerts.map(alert => (
                      <AlertItem key={alert.id} alert={alert} />
                    ))}
                  </ScrollArea>
                  <div className="p-2 text-center">
                    <Button variant="link" size="sm" className="text-xs">View All Notifications</Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile dialog component */}
            <ProfileDialog className="hidden md:flex" />
            
            <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => setShowHelpDialog(true)}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
            
            <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Help & Information</DialogTitle>
                  <DialogDescription>
                    Learn more about using the NepalAir personal exposure monitoring dashboard
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <h3 className="font-medium text-sm">Dashboard Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      The dashboard displays your personal air quality exposure data, alongside regional monitoring information and health recommendations.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Understanding AQI</h3>
                    <p className="text-sm text-muted-foreground">
                      Air Quality Index (AQI) is a standardized indicator for reporting air quality. Higher values indicate worse air pollution and increased health concerns.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Data Sources</h3>
                    <p className="text-sm text-muted-foreground">
                      Data is collected from government monitoring stations, your personal exposure monitor, and meteorological services.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowHelpDialog(false)}>Close</Button>
                  <Button>View Full Guide</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </header>
        
        {mobileMenuOpen && (
          <div className="md:hidden border-b bg-background">
            <div className="flex flex-col space-y-2 p-4">
              {/* Add the ProfileDialog for mobile */}
              <ProfileDialog 
                trigger={
                  <Button variant="ghost" size="sm" className="justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                } 
              />
              <Button variant="ghost" size="sm" className="justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Select Date
              </Button>
              <Button variant="ghost" size="sm" className="justify-start">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </Button>
              <Button variant="ghost" size="sm" className="justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="justify-start text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
        
        <main className="flex-1 p-4 md:p-6 bg-gray-50">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current AQI</CardTitle>
                <CardDescription>Kathmandu Valley</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold">{currentAqi}</div>
                  <Badge className={getAqiColor(currentAqi)}>Very Unhealthy</Badge>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3 inline" />
                    Last updated 15 minutes ago
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
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    156% of WHO recommended limit (25 μg/m³)
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
                  <div className="text-4xl font-bold">Kalanki</div>
                  <Badge variant="outline" className="mt-1 w-fit">
                    <Clock className="mr-1 h-3 w-3" />
                    8:15 - 9:00 AM
                  </Badge>
                  <div className="mt-2 text-xs text-muted-foreground">
                    During morning commute (156 μg/m³)
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Alert</CardTitle>
                <CardDescription>Take action now</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">High Pollution Alert</AlertTitle>
                  <AlertDescription className="text-red-700">
                    Unhealthy air quality expected during evening rush hour (5-7 PM).
                  </AlertDescription>
                </Alert>
                <Button variant="link" size="sm" className="mt-2 p-0">
                  See recommended actions
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="dashboard" className="mt-6">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="dashboard">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="map">
                <MapIcon className="mr-2 h-4 w-4" />
                Map View
              </TabsTrigger>
              <TabsTrigger value="personal">
                <User className="mr-2 h-4 w-4" />
                Personal Insights
              </TabsTrigger>
              <TabsTrigger value="weather">
                <Thermometer className="mr-2 h-4 w-4" />
                Weather Factors
              </TabsTrigger>
              <TabsTrigger value="stations">
                <Layers className="mr-2 h-4 w-4" />
                Monitoring Stations
              </TabsTrigger>
              <TabsTrigger value="news">
                <FileText className="mr-2 h-4 w-4" />
                News & Alerts
              </TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Weekly Exposure Trends</CardTitle>
                    <CardDescription>
                      PM2.5 and PM10 levels over the past week
                    </CardDescription>
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
                  <CardHeader>
                    <CardTitle>Exposure by Location</CardTitle>
                    <CardDescription>
                      Where you experience the most pollution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={exposureByLocation}
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
                            {exposureByLocation.map((entry, index) => (
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

              {/* Add the personalized exposure analysis component */}
              <PersonalizedExposureAnalysis />

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Pattern</CardTitle>
                    <CardDescription>Time of day exposure analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={hourlyExposureData}
                          margin={{ top: 10, right: 30, bottom: 50, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" label={{ value: 'Time of Day', position: 'insideBottom', offset: -10 }} />
                          <YAxis label={{ value: 'PM2.5 (μg/m³)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#0ea5e9"
                            fill="#0ea5e9"
                            fillOpacity={0.3}
                            name="PM2.5 Level"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Exposure Heatmap</CardTitle>
                    <CardDescription>Weekly patterns by time of day</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={heatmapData}
                          margin={{ top: 10, right: 30, bottom: 50, left: 20 }}
                          barGap={0}
                          barCategoryGap={0}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" label={{ value: 'Time of Day', position: 'insideBottom', offset: -10 }} />
                          <YAxis label={{ value: 'PM2.5 (μg/m³)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip 
                            formatter={(value, name) => [`${value} μg/m³`, name]}
                            labelFormatter={(label) => `Time: ${label}`}
                          />
                          <Legend verticalAlign="top" />
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                            <Bar 
                              key={day} 
                              dataKey={day} 
                              name={day}
                              isAnimationActive={true}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                  <CardDescription>
                    Based on your exposure patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="flex items-start space-x-4 p-3 rounded-lg bg-slate-50">
                        <Badge variant={getRecommendationColor(rec.category)} className="mt-0.5">
                          {rec.category}
                        </Badge>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{rec.text}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <rec.icon className="h-3 w-3 inline mr-1" />
                            {rec.route}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Apply</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Map View Tab */}
            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Air Quality Map</CardTitle>
                      <CardDescription>
                        Interactive map showing air quality across Kathmandu Valley
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setIsMapFullscreen(!isMapFullscreen)}>
                        {isMapFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      </Button>
                      <Select defaultValue="airQuality">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Map Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="airQuality">Air Quality</SelectItem>
                          <SelectItem value="exposure">Personal Exposure</SelectItem>
                          <SelectItem value="pollution">Pollution Sources</SelectItem>
                          <SelectItem value="satellite">Satellite View</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className={isMapFullscreen ? "h-[80vh]" : ""}>
                  <KathmanduMap />
                </CardContent>
                <CardFooter>
                  <div className="text-sm text-muted-foreground">
                    Map data updated 15 minutes ago. Click on locations to see detailed air quality information.
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Personal Insights Tab */}
            <TabsContent value="personal">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Insights</CardTitle>
                    <CardDescription>
                      Tailored analysis of your exposure patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Exposure Summary</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="text-sm font-medium text-slate-500">Daily Average</div>
                            <div className="text-2xl font-bold mt-1">78 μg/m³</div>
                            <div className="text-xs text-red-600 mt-1">156% of WHO guideline</div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="text-sm font-medium text-slate-500">Weekly Trend</div>
                            <div className="text-2xl font-bold mt-1">↑ 12%</div>
                            <div className="text-xs text-slate-500 mt-1">Compared to last week</div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="text-sm font-medium text-slate-500">Highest Risk Time</div>
                            <div className="text-2xl font-bold mt-1">8-9 AM</div>
                            <div className="text-xs text-slate-500 mt-1">During commute hours</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Health Impact Assessment</h3>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="text-sm">
                            Based on your exposure patterns, your current air pollution exposure may contribute to:
                          </div>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                            <li>Increased risk of respiratory symptoms</li>
                            <li>Potential aggravation of existing conditions</li>
                            <li>Long-term cardiovascular stress if sustained</li>
                          </ul>
                          <div className="mt-3 text-sm">
                            Following the recommended actions could reduce your health risks by up to 35%.
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Long-term Analysis</h3>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={monthlyTrendData}
                              margin={{ top: 10, right: 30, bottom: 30, left: 20 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis label={{ value: 'PM2.5 (μg/m³)', angle: -90, position: 'insideLeft' }} />
                              <Tooltip formatter={(value) => [`${value} μg/m³`, 'PM2.5']} />
                              <Bar dataKey="PM25" fill="#8884d8" name="PM2.5 Level">
                                {monthlyTrendData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={getHeatmapCellColor(entry.PM25)} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Health Impact Metrics</CardTitle>
                    <CardDescription>How air quality affects your health</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {healthImpactData.map((data, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <data.icon className="h-5 w-5 text-blue-500" />
                              <span className="font-medium">{data.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {data.current}% vs {data.recommended}% recommended
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${data.current}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="h-80 mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={90} data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} />
                            <Radar name="Your Exposure" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Radar name="WHO Guidelines" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                            <Legend />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Download Health Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Weather Factors Tab */}
            <TabsContent value="weather">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Weather Influence on Air Quality</CardTitle>
                    <CardDescription>How weather affects pollution levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                        <Thermometer className="h-8 w-8 text-blue-500 mb-2" />
                        <div className="text-2xl font-bold">28°C</div>
                        <div className="text-xs text-center text-muted-foreground">Current Temperature</div>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                        <Droplets className="h-8 w-8 text-blue-500 mb-2" />
                        <div className="text-2xl font-bold">65%</div>
                        <div className="text-xs text-center text-muted-foreground">Humidity</div>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                        <Wind className="h-8 w-8 text-blue-500 mb-2" />
                        <div className="text-2xl font-bold">8 km/h</div>
                        <div className="text-xs text-center text-muted-foreground">Wind Speed</div>
                      </div>
                    </div>
                    
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={hourlyExposureData}
                          margin={{ top: 10, right: 30, bottom: 50, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" label={{ value: 'Time of Day', position: 'insideBottom', offset: -10 }} />
                          <YAxis yAxisId="left" label={{ value: 'PM2.5 (μg/m³)', angle: -90, position: 'insideLeft' }} />
                          <YAxis yAxisId="right" orientation="right" domain={[0, 35]} label={{ value: 'Temperature (°C)', angle: 90, position: 'insideRight' }} />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="value" stroke="#8884d8" name="PM2.5" />
                          <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature" />
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
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={weatherTrendData}
                          margin={{ top: 10, right: 30, bottom: 50, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }} />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature" />
                          <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#0088fe" name="Humidity" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Weather-Pollution Correlation</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Temperature-PM2.5 Correlation</span>
                          <Badge variant="outline">+0.65</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Humidity-PM2.5 Correlation</span>
                          <Badge variant="outline">-0.42</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Wind Speed-PM2.5 Correlation</span>
                          <Badge variant="outline">-0.78</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Monitoring Stations Tab - Implementation continued in the next part due to length */}
            <TabsContent value="stations">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle>Air Quality Monitoring Stations</CardTitle>
                      <CardDescription>
                        Live data from monitoring stations across Nepal
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input placeholder="Search stations..." className="w-full sm:w-64" />
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Stations</SelectItem>
                          <SelectItem value="active">Active Only</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 border-b bg-slate-50 p-2 text-sm font-medium">
                      <div className="col-span-3">Station Name</div>
                      <div className="col-span-2">Location</div>
                      <div className="col-span-1 text-center">Status</div>
                      <div className="col-span-1 text-center">PM2.5</div>
                      <div className="col-span-1 text-center">PM10</div>
                      <div className="col-span-2 text-center">AQI</div>
                      <div className="col-span-2 text-right">Last Update</div>
                    </div>
                    <ScrollArea className="h-[calc(100vh-500px)] min-h-[300px]">
                      {airQualityMonitoringStations.map((station) => (
                        <div key={station.id} className="grid grid-cols-12 border-b p-3 text-sm hover:bg-slate-50">
                          <div className="col-span-3 font-medium">{station.name}</div>
                          <div className="col-span-2 text-muted-foreground">{station.location}</div>
                          <div className="col-span-1 text-center">
                            {station.status === 'Active' && <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">Active</Badge>}
                            {station.status === 'Maintenance' && <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">Maintenance</Badge>}
                            {station.status === 'Inactive' && <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">Inactive</Badge>}
                          </div>
                          <div className="col-span-1 text-center">{station.pm25 || '—'}</div>
                          <div className="col-span-1 text-center">{station.pm10 || '—'}</div>
                          <div className="col-span-2 text-center">
                            {station.aqi ? (
                              <Badge className={getAqiColor(station.aqi)}>
                                {station.aqi} - {getAqiCategory(station.aqi)}
                              </Badge>
                            ) : '—'}
                          </div>
                          <div className="col-span-2 text-right text-muted-foreground">{station.lastUpdate}</div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing all {airQualityMonitoringStations.length} stations
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="mr-2">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                    <Button size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* News & Alerts Tab */}
            <TabsContent value="news">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Air Quality News</CardTitle>
                    <CardDescription>
                      Updates on air quality initiatives and research
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[calc(100vh-400px)] min-h-[400px]">
                      <div className="space-y-6">
                        {airQualityNews.map((news) => (
                          <div key={news.id} className="border-b pb-4 last:border-0">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-medium">{news.title}</h3>
                              <Badge variant="outline">{news.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{news.summary}</p>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span>{news.source}</span>
                              <span>{news.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Air Quality Resources</CardTitle>
                    <CardDescription>
                      Educational materials and useful links
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-medium flex items-center">
                          <Lungs className="h-5 w-5 mr-2 text-blue-500" />
                          Health Guidelines
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Learn how to protect yourself during high pollution days with these health guidelines.
                        </p>
                        <Button variant="link" size="sm" className="mt-1 p-0">
                          Read Guidelines
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-medium flex items-center">
                          <MapIcon className="h-5 w-5 mr-2 text-blue-500" />
                          Air Quality Index Explained
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Understand what the AQI numbers mean and how they relate to health impacts.
                        </p>
                        <Button variant="link" size="sm" className="mt-1 p-0">
                          View Guide
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-medium flex items-center">
                          <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                          Community Initiatives
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Join local community efforts to monitor and improve air quality in your area.
                        </p>
                        <Button variant="link" size="sm" className="mt-1 p-0">
                          Get Involved
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-medium flex items-center">
                          <Mail className="h-5 w-5 mr-2 text-blue-500" />
                          Subscribe to Alerts
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Receive daily air quality forecasts and alerts directly to your email.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Input placeholder="Your email address" className="max-w-sm" />
                          <Button size="sm">Subscribe</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        <footer className="border-t bg-background p-4 text-center text-sm text-muted-foreground">
          NepalAir Personal Exposure Monitoring — Helping you breathe easier © 2023
        </footer>
      </div>
    </ProfileProvider>
  );
}