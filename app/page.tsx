// app/page.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  CalendarDays, 
  MapPin, 
  AlertTriangle, 
  Wind, 
  Clock, 
  ChevronRight,
  BarChart3,
  Map,
  User,
  Bell
} from 'lucide-react'

// Dummy data
// Sample historical exposure data
const exposureHistory = [
  { date: '2023-04-01', pm25: 35, pm10: 65, location: 'Thamel', aqiCategory: 'Moderate' },
  { date: '2023-04-02', pm25: 22, pm10: 45, location: 'Patan', aqiCategory: 'Good' },
  { date: '2023-04-03', pm25: 120, pm10: 180, location: 'Kalanki', aqiCategory: 'Unhealthy' },
  { date: '2023-04-04', pm25: 85, pm10: 125, location: 'Balaju', aqiCategory: 'Unhealthy for Sensitive Groups' },
  { date: '2023-04-05', pm25: 28, pm10: 52, location: 'Bhaktapur', aqiCategory: 'Moderate' },
  { date: '2023-04-06', pm25: 18, pm10: 32, location: 'Lalitpur', aqiCategory: 'Good' },
  { date: '2023-04-07', pm25: 156, pm10: 210, location: 'Koteshwor', aqiCategory: 'Very Unhealthy' },
]

const weeklyData = [
  { day: 'Mon', PM25: 35, PM10: 65 },
  { day: 'Tue', PM25: 22, PM10: 45 },
  { day: 'Wed', PM25: 120, PM10: 180 },
  { day: 'Thu', PM25: 85, PM10: 125 },
  { day: 'Fri', PM25: 28, PM10: 52 },
  { day: 'Sat', PM25: 18, PM10: 32 },
  { day: 'Sun', PM25: 42, PM10: 78 },
]

const hourlyExposureData = [
  { time: '6am', value: 15 },
  { time: '8am', value: 85 },
  { time: '10am', value: 60 },
  { time: '12pm', value: 45 },
  { time: '2pm', value: 30 },
  { time: '4pm', value: 55 },
  { time: '6pm', value: 95 },
  { time: '8pm', value: 40 },
]

const exposureByLocation = [
  { name: 'Thamel', value: 35, fill: '#0088FE' },
  { name: 'Kalanki', value: 120, fill: '#00C49F' },
  { name: 'Balaju', value: 85, fill: '#FFBB28' },
  { name: 'Bhaktapur', value: 28, fill: '#FF8042' },
  { name: 'Lalitpur', value: 18, fill: '#8884d8' },
]

// Transform heatmap data for recharts
const heatmapData = [
  { name: '6-9 AM', Mon: 78, Tue: 56, Wed: 110, Thu: 92, Fri: 36 },
  { name: '9-12 PM', Mon: 55, Tue: 32, Wed: 98, Thu: 76, Fri: 29 },
  { name: '12-3 PM', Mon: 43, Tue: 25, Wed: 85, Thu: 64, Fri: 25 },
  { name: '3-6 PM', Mon: 91, Tue: 47, Wed: 132, Thu: 110, Fri: 47 },
  { name: '6-9 PM', Mon: 81, Tue: 52, Wed: 142, Thu: 89, Fri: 38 },
]

const recommendations = [
  { id: 1, text: 'Consider using an N95 mask during your morning commute to Kalanki', category: 'Critical', route: 'Home to Office' },
  { id: 2, text: 'Schedule outdoor exercise before 9 AM when pollution levels are lower', category: 'Health', route: 'Daily Routine' },
  { id: 3, text: 'Alternative route via Lalitpur reduces your PM2.5 exposure by 45%', category: 'Route', route: 'Office to Home' },
  { id: 4, text: 'Close windows during evening hours (6-8 PM) when pollution spikes', category: 'Home', route: 'Indoor Air' },
]

// Helper function to get color based on AQI level
const getAqiColor = (value: number) => {
  if (value <= 50) return 'bg-green-100 text-green-800 hover:bg-green-200';
  if (value <= 100) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
  if (value <= 150) return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
  if (value <= 200) return 'bg-red-100 text-red-800 hover:bg-red-200';
  if (value <= 300) return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
  return 'bg-rose-100 text-rose-800 hover:bg-rose-200';
};

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const getRecommendationColor = (category: string): BadgeVariant => {
  switch (category) {
    case 'Critical': return 'destructive';
    case 'Health': return 'default';
    case 'Route': return 'secondary';
    case 'Home': return 'outline';
    default: return 'default';
  }
};

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const BLUE_COLORS = ['#edf8fb', '#b2e2e2', '#66c2a4', '#2ca25f', '#006d2c'];

export default function Dashboard() {
  const [currentAqi] = useState(156);
  const [exposure] = useState(78);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentAlerts] = useState([
    { id: 1, title: 'High Pollution Alert', message: 'PM2.5 levels exceeding 150 μg/m³ near your home', time: '30 minutes ago' },
    { id: 2, title: 'Route Warning', message: 'Heavy congestion on your regular route - air quality degraded', time: '2 hours ago' },
  ]);
  
  // Function to calculate the exposure summary based on history
  const getExposureSummary = () => {
    return {
      dailyAverage: exposureHistory.reduce((sum, day) => sum + day.pm25, 0) / exposureHistory.length,
      weeklyTrend: '+12%',
      highestValue: Math.max(...exposureHistory.map(day => day.pm25)),
      highestLocation: exposureHistory.sort((a, b) => b.pm25 - a.pm25)[0].location
    };
  }
  
  // Generate custom heatmap colors based on value
  const getHeatmapCellColor = (value: number) => {
    if (value <= 30) return '#edf8fb';
    if (value <= 60) return '#b2e2e2';
    if (value <= 90) return '#66c2a4';
    if (value <= 120) return '#2ca25f';
    return '#006d2c';
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Wind className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold">NepalAir: Personal Exposure Monitor</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="mr-2 h-4 w-4" />
              Alerts
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {recentAlerts.length}
              </span>
            </Button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                <div className="p-2 border-b border-gray-200">
                  <h3 className="font-medium">Recent Alerts</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {recentAlerts.map(alert => (
                    <div key={alert.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                      <div className="font-medium text-sm">{alert.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{alert.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{alert.time}</div>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center">
                  <Button variant="link" size="sm" className="text-xs">View All Notifications</Button>
                </div>
              </div>
            )}
          </div>
          <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>
      </header>
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
          <TabsList>
            <TabsTrigger value="dashboard">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map className="mr-2 h-4 w-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="personal">
              <User className="mr-2 h-4 w-4" />
              Personal Insights
            </TabsTrigger>
          </TabsList>
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

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Pattern</CardTitle>
                  <CardDescription>Time of day exposure analysis</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={hourlyExposureData}
                        margin={{ top: 10, right: 30, bottom: 50, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" label={{ value: 'Time of Day', position: 'insideBottom', offset: -10 }} />
                        <YAxis label={{ value: 'PM2.5 (μg/m³)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#0ea5e9"
                          strokeWidth={2}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 8 }}
                          name="PM2.5 Level"
                          fill="#0ea5e9"
                        />
                      </LineChart>
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
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                          <Bar 
                            key={day} 
                            dataKey={day} 
                            fill={BLUE_COLORS[index]} 
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
                          <CalendarDays className="h-3 w-3 inline mr-1" />
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
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Air Quality Map</CardTitle>
                <CardDescription>
                  Interactive map showing air quality across Kathmandu Valley
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] bg-slate-100 rounded-md flex items-center justify-center">
                  <div className="text-center p-6">
                    <Map className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium">Interactive Map View</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-md">
                      The full implementation would include an interactive map with color-coded air quality
                      indicators, your location history, and pollution hotspots.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="personal">
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
                          data={[
                            { month: 'Jan', value: 45 },
                            { month: 'Feb', value: 68 },
                            { month: 'Mar', value: 78 },
                            { month: 'Apr', value: 92 },
                            { month: 'May', value: 65 },
                            { month: 'Jun', value: 42 },
                          ]}
                          margin={{ top: 10, right: 30, bottom: 30, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis label={{ value: 'PM2.5 (μg/m³)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip formatter={(value) => [`${value} μg/m³`, 'PM2.5']} />
                          <Bar dataKey="value" fill="#8884d8" name="PM2.5 Level">
                            {[
                              { month: 'Jan', value: 45 },
                              { month: 'Feb', value: 68 },
                              { month: 'Mar', value: 78 },
                              { month: 'Apr', value: 92 },
                              { month: 'May', value: 65 },
                              { month: 'Jun', value: 42 },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getHeatmapCellColor(entry.value)} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t bg-background p-4 text-center text-sm text-muted-foreground">
        NepalAir Personal Exposure Monitoring — Helping you breathe easier © 2023
      </footer>
    </div>
  )
}