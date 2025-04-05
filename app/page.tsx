// app/page.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveHeatMap } from '@nivo/heatmap'
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
const exposureData = [
  { date: '2023-04-01', pm25: 35, pm10: 65, location: 'Thamel', aqiCategory: 'Moderate' },
  { date: '2023-04-02', pm25: 22, pm10: 45, location: 'Patan', aqiCategory: 'Good' },
  { date: '2023-04-03', pm25: 120, pm10: 180, location: 'Kalanki', aqiCategory: 'Unhealthy' },
  { date: '2023-04-04', pm25: 85, pm10: 125, location: 'Balaju', aqiCategory: 'Unhealthy for Sensitive Groups' },
  { date: '2023-04-05', pm25: 28, pm10: 52, location: 'Bhaktapur', aqiCategory: 'Moderate' },
  { date: '2023-04-06', pm25: 18, pm10: 32, location: 'Lalitpur', aqiCategory: 'Good' },
  { date: '2023-04-07', pm25: 156, pm10: 210, location: 'Koteshwor', aqiCategory: 'Very Unhealthy' },
]

const weeklyData = [
  {
    id: 'PM2.5',
    data: [
      { x: 'Mon', y: 35 },
      { x: 'Tue', y: 22 },
      { x: 'Wed', y: 120 },
      { x: 'Thu', y: 85 },
      { x: 'Fri', y: 28 },
      { x: 'Sat', y: 18 },
      { x: 'Sun', y: 42 },
    ],
  },
  {
    id: 'PM10',
    data: [
      { x: 'Mon', y: 65 },
      { x: 'Tue', y: 45 },
      { x: 'Wed', y: 180 },
      { x: 'Thu', y: 125 },
      { x: 'Fri', y: 52 },
      { x: 'Sat', y: 32 },
      { x: 'Sun', y: 78 },
    ],
  },
]

const hourlyExposureData = [
  {
    id: 'hourly',
    data: [
      { x: '6am', y: 15 },
      { x: '8am', y: 85 },
      { x: '10am', y: 60 },
      { x: '12pm', y: 45 },
      { x: '2pm', y: 30 },
      { x: '4pm', y: 55 },
      { x: '6pm', y: 95 },
      { x: '8pm', y: 40 },
    ],
  },
]

const exposureByLocation = [
  { id: 'Thamel', value: 35 },
  { id: 'Kalanki', value: 120 },
  { id: 'Balaju', value: 85 },
  { id: 'Bhaktapur', value: 28 },
  { id: 'Lalitpur', value: 18 },
]

const heatmapData = [
  {
    id: 'Mon',
    data: [
      { x: '6-9 AM', y: 78 },
      { x: '9-12 PM', y: 55 },
      { x: '12-3 PM', y: 43 },
      { x: '3-6 PM', y: 91 },
      { x: '6-9 PM', y: 81 },
    ],
  },
  {
    id: 'Tue',
    data: [
      { x: '6-9 AM', y: 56 },
      { x: '9-12 PM', y: 32 },
      { x: '12-3 PM', y: 25 },
      { x: '3-6 PM', y: 47 },
      { x: '6-9 PM', y: 52 },
    ],
  },
  {
    id: 'Wed',
    data: [
      { x: '6-9 AM', y: 110 },
      { x: '9-12 PM', y: 98 },
      { x: '12-3 PM', y: 85 },
      { x: '3-6 PM', y: 132 },
      { x: '6-9 PM', y: 142 },
    ],
  },
  {
    id: 'Thu',
    data: [
      { x: '6-9 AM', y: 92 },
      { x: '9-12 PM', y: 76 },
      { x: '12-3 PM', y: 64 },
      { x: '3-6 PM', y: 110 },
      { x: '6-9 PM', y: 89 },
    ],
  },
  {
    id: 'Fri',
    data: [
      { x: '6-9 AM', y: 36 },
      { x: '9-12 PM', y: 29 },
      { x: '12-3 PM', y: 25 },
      { x: '3-6 PM', y: 47 },
      { x: '6-9 PM', y: 38 },
    ],
  },
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

const getRecommendationColor = (category: string) => {
  switch (category) {
    case 'Critical': return 'destructive';
    case 'Health': return 'default';
    case 'Route': return 'secondary';
    case 'Home': return 'outline';
    default: return 'default';
  }
};

export default function Dashboard() {
  const [currentAqi] = useState(156);
  const [exposure] = useState(78);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Wind className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold">NepalAir: Personal Exposure Monitor</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Alerts
          </Button>
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
              <CardDescription>Today's hotspot</CardDescription>
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
                    <ResponsiveLine
                      data={weeklyData}
                      margin={{ top: 10, right: 110, bottom: 50, left: 60 }}
                      xScale={{ type: 'point' }}
                      yScale={{
                        type: 'linear',
                        min: 0,
                        max: 'auto',
                      }}
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Day of Week',
                        legendOffset: 36,
                        legendPosition: 'middle',
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Concentration (μg/m³)',
                        legendOffset: -40,
                        legendPosition: 'middle',
                      }}
                      colors={{ scheme: 'category10' }}
                      pointSize={10}
                      pointColor={{ theme: 'background' }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: 'serieColor' }}
                      pointLabelYOffset={-12}
                      useMesh={true}
                      legends={[
                        {
                          anchor: 'bottom-right',
                          direction: 'column',
                          justify: false,
                          translateX: 100,
                          translateY: 0,
                          itemsSpacing: 0,
                          itemDirection: 'left-to-right',
                          itemWidth: 80,
                          itemHeight: 20,
                          itemOpacity: 0.75,
                          symbolSize: 12,
                          symbolShape: 'circle',
                          symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        },
                      ]}
                    />
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
                    <ResponsivePie
                      data={exposureByLocation}
                      margin={{ top: 20, right: 20, bottom: 80, left: 20 }}
                      innerRadius={0.5}
                      padAngle={0.7}
                      cornerRadius={3}
                      activeOuterRadiusOffset={8}
                      colors={{ scheme: 'blues' }}
                      borderWidth={1}
                      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsTextColor="rgb(51, 51, 51)"
                      arcLinkLabelsThickness={2}
                      arcLinkLabelsColor={{ from: 'color' }}
                      arcLabelsSkipAngle={10}
                      arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                      legends={[
                        {
                          anchor: 'bottom',
                          direction: 'row',
                          justify: false,
                          translateX: 0,
                          translateY: 56,
                          itemsSpacing: 0,
                          itemWidth: 80,
                          itemHeight: 18,
                          itemTextColor: '#999',
                          itemDirection: 'left-to-right',
                          itemOpacity: 1,
                          symbolSize: 18,
                          symbolShape: 'circle',
                        },
                      ]}
                    />
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
                    <ResponsiveLine
                      data={hourlyExposureData}
                      margin={{ top: 10, right: 30, bottom: 50, left: 60 }}
                      xScale={{ type: 'point' }}
                      yScale={{ type: 'linear', min: 0, max: 100 }}
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Time of Day',
                        legendOffset: 36,
                        legendPosition: 'middle',
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'PM2.5 (μg/m³)',
                        legendOffset: -40,
                        legendPosition: 'middle',
                      }}
                      colors={["#0ea5e9"]}
                      pointSize={10}
                      pointColor={{ theme: 'background' }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: 'serieColor' }}
                      pointLabelYOffset={-12}
                      useMesh={true}
                      enableArea={true}
                      areaOpacity={0.15}
                    />
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
                    <ResponsiveHeatMap
                      data={heatmapData}
                      margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
                      valueFormat=">-.2s"
                      axisTop={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: '',
                        legendOffset: 46
                      }}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: 'Time of Day',
                        legendPosition: 'middle',
                        legendOffset: 46
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Day',
                        legendPosition: 'middle',
                        legendOffset: -40
                      }}
                      colors={{
                        type: 'sequential',
                        scheme: 'blues',
                        minValue: 20,
                        maxValue: 150
                      }}
                      emptyColor="#f5f5f5"
                      borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
                      legends={[
                        {
                          anchor: 'bottom',
                          translateX: 0,
                          translateY: 30,
                          length: 240,
                          thickness: 10,
                          direction: 'row',
                          tickPosition: 'after',
                          tickSize: 3,
                          tickSpacing: 4,
                          tickOverlap: false,
                          title: 'PM2.5 Level →',
                          titleAlign: 'start',
                          titleOffset: 4
                        }
                      ]}
                    />
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
                      <Badge variant={getRecommendationColor(rec.category) as any} className="mt-0.5">
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
                      <ResponsiveBar
                        data={[
                          { month: 'Jan', value: 45 },
                          { month: 'Feb', value: 68 },
                          { month: 'Mar', value: 78 },
                          { month: 'Apr', value: 92 },
                          { month: 'May', value: 65 },
                          { month: 'Jun', value: 42 },
                        ]}
                        keys={['value']}
                        indexBy="month"
                        margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
                        padding={0.3}
                        colors={{ scheme: 'blues' }}
                        axisBottom={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'Month',
                          legendPosition: 'middle',
                          legendOffset: 32
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'PM2.5 (μg/m³)',
                          legendPosition: 'middle',
                          legendOffset: -40
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                      />
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