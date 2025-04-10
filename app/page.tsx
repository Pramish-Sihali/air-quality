'use client'

import { useEffect, useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
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
  Bell,
  Droplets,
  ExternalLink,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ThermometerSun,
  Filter,
  Download,
  ChevronDown
} from 'lucide-react'

// Import our custom data utilities without PapaParse
import { 
  loadCSV, 
  convertToLineChartData, 
  convertHourlyToChartData,
  convertToPieChartData,
  convertToHeatmapData,
  calculateExposureSummary,
  getAqiColor,
  getAqiText,
  getRecommendationVariant,
  getAlertSeverityColor,
  getHighestExposureData,
  getCriticalAlert,
  generateHealthImpactAssessment,
  ExposureRecord,
  HourlyExposure,
  LocationData,
  WeeklyPattern,
  Recommendation,
  Alert,
  ExposureSummary,
  HighestExposureData
} from '../lib/data-utils'

// Custom Alert component to replace shadcn Alert
const CustomAlert = ({ 
  className = "", 
  children, 
  icon 
}: { 
  className?: string, 
  children: React.ReactNode, 
  icon?: React.ReactNode 
}) => {
  return (
    <div className={`p-4 rounded-lg border flex items-start gap-2 ${className}`}>
      {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
      <div>{children}</div>
    </div>
  );
};

const CustomAlertTitle = ({ children }: { children: React.ReactNode }) => (
  <h5 className="font-medium mb-1">{children}</h5>
);

const CustomAlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">{children}</div>
);

interface SelectOption {
  value: string;
  label: string;
}

// Custom Select component to replace shadcn Select
const CustomSelect = ({ 
  options, 
  value, 
  onChange,
  placeholder = "Select option"
}: {
  options: SelectOption[],
  value: string,
  onChange: (value: string) => void,
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <div className="relative">
      <button
        type="button"
        className="w-[140px] h-8 text-sm bg-white flex items-center justify-between px-3 py-1.5 rounded-md border border-gray-200 text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-100 ${value === option.value ? 'bg-gray-50 font-medium' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  // State for data
  const [exposureHistory, setExposureHistory] = useState<ExposureRecord[]>([]);
  const [hourlyExposure, setHourlyExposure] = useState<HourlyExposure[]>([]);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [weeklyPattern, setWeeklyPattern] = useState<WeeklyPattern[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [currentAqi, setCurrentAqi] = useState(156);
  const [exposure, setExposure] = useState(78);
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeFilter, setTimeFilter] = useState('week');
  
  // Derived data
  const [exposureSummary, setExposureSummary] = useState<ExposureSummary | null>(null);
  const [highestExposure, setHighestExposure] = useState<HighestExposureData | null>(null);
  const [criticalAlert, setCriticalAlert] = useState<Alert | undefined>(undefined);
  const [healthImpacts, setHealthImpacts] = useState<string[]>([]);

  // Time filter options
  const timeFilterOptions = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  // Load data on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      
      try {
        // Load all CSV data files
        const exposureData = await loadCSV<ExposureRecord>('/exposure_history.csv');
        const hourlyData = await loadCSV<HourlyExposure>('/hourly_exposure.csv');
        const locationsData = await loadCSV<LocationData>('/location_data.csv');
        const weeklyData = await loadCSV<WeeklyPattern>('/weekly_pattern.csv');
        const recsData = await loadCSV<Recommendation>('/recommendations.csv');
        const alertsData = await loadCSV<Alert>('/alerts.csv');
        
        // Update state with loaded data
        setExposureHistory(exposureData);
        setHourlyExposure(hourlyData);
        setLocationData(locationsData);
        setWeeklyPattern(weeklyData);
        setRecommendations(recsData);
        setAlerts(alertsData);
        
        // Calculate derived data
        const summary = calculateExposureSummary(exposureData);
        setExposureSummary(summary);
        
        // Set current AQI from summary data if available
        if (summary?.currentAqi) {
          setCurrentAqi(summary.currentAqi);
        }
        
        const highest = getHighestExposureData(hourlyData);
        setHighestExposure(highest);
        
        const critical = getCriticalAlert(alertsData);
        setCriticalAlert(critical);
        
        if (summary) {
          setExposure(Math.round(summary.dailyAverage));
          const impacts = generateHealthImpactAssessment(summary);
          setHealthImpacts(impacts);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Update data when time filter changes
  useEffect(() => {
    // In a real app, we would filter the data based on timeFilter
    // For now, we'll just log the change
    console.log(`Time filter changed to: ${timeFilter}`);
    // This would update the currentAqi based on the selected timeframe
    if (timeFilter === 'day') {
      // For demo purposes, set a different AQI value based on filter
      setCurrentAqi(148);
    } else if (timeFilter === 'week') {
      setCurrentAqi(156);
    } else if (timeFilter === 'month') {
      setCurrentAqi(132);
    }
  }, [timeFilter]);
  
  // Prepare chart data
  const lineChartData = convertToLineChartData(exposureHistory);
  const hourlyChartData = convertHourlyToChartData(hourlyExposure);
  const pieChartData = convertToPieChartData(locationData);
  const heatmapData = convertToHeatmapData(weeklyPattern);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Wind className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold">NepalAir: Personal Exposure Monitor</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Skeleton className="h-9 w-[80px]" />
            <Skeleton className="h-9 w-[80px]" />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-slate-50">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-[140px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-10 w-[100px]" />
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6">
            <Skeleton className="h-12 w-[300px] mb-4" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
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
              className="flex items-center"
            >
              <Bell className="mr-2 h-4 w-4" />
              Alerts
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </Button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                <div className="p-2 border-b border-gray-200">
                  <h3 className="font-medium">Recent Alerts</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {alerts.map(alert => (
                    <div key={alert.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                      <div className="font-medium text-sm">{alert.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{alert.message}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">{alert.time}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            alert.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' : 
                            alert.severity === 'Warning' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center">
                  <Button variant="link" size="sm" className="text-xs">View All Notifications</Button>
                </div>
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button variant="default" size="sm" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 bg-slate-50">
        {/* Filter Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Personal Air Quality Dashboard</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">Filter by:</span>
            </div>
            <CustomSelect 
              options={timeFilterOptions}
              value={timeFilter}
              onChange={setTimeFilter}
              placeholder="Time Period"
            />
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <ThermometerSun className="h-4 w-4 mr-2 text-blue-500" />
                Current AQI
              </CardTitle>
              <CardDescription>Kathmandu Valley</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold">{currentAqi}</div>
                <Badge className={`mt-1 ${getAqiColor(currentAqi)}`}>
                  {getAqiText(currentAqi)}
                </Badge>
                <div className="mt-2 text-xs text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3 inline" />
                  Last updated 15 minutes ago
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                Your Daily Exposure
              </CardTitle>
              <CardDescription>Compared to WHO Guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-4xl font-bold">{exposure} μg/m³</div>
                <div className="mt-2">
                  <Progress value={exposure * 2} className="h-2" />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {exposureSummary?.exposureAboveWHO} of WHO recommended limit (25 μg/m³)
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                Highest Exposure
              </CardTitle>
              <CardDescription>Today&apos;s hotspot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-4xl font-bold">{highestExposure?.location || 'Loading...'}</div>
                <Badge variant="outline" className="mt-1 w-fit">
                  <Clock className="mr-1 h-3 w-3" />
                  {highestExposure?.time || '8:15 - 9:00 AM'}
                </Badge>
                <div className="mt-2 text-xs text-muted-foreground">
                  During morning commute ({highestExposure?.value || 156} μg/m³)
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                Alert
              </CardTitle>
              <CardDescription>Take action now</CardDescription>
            </CardHeader>
            <CardContent>
              {criticalAlert ? (
                <CustomAlert className={getAlertSeverityColor(criticalAlert.severity)} icon={<AlertTriangle className="h-4 w-4 text-red-600" />}>
                  <CustomAlertTitle>{criticalAlert.title}</CustomAlertTitle>
                  <CustomAlertDescription>{criticalAlert.message}</CustomAlertDescription>
                </CustomAlert>
              ) : (
                <CustomAlert className="bg-green-50 border-green-200" icon={<AlertTriangle className="h-4 w-4 text-green-600" />}>
                  <CustomAlertTitle>No Critical Alerts</CustomAlertTitle>
                  <CustomAlertDescription>
                    Air quality is currently within acceptable parameters.
                  </CustomAlertDescription>
                </CustomAlert>
              )}
              <Button variant="link" size="sm" className="mt-2 p-0">
                See recommended actions
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 rounded-lg bg-slate-100 p-1">
            <TabsTrigger value="dashboard" className="flex items-center justify-center rounded-md py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center justify-center rounded-md py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Map className="mr-2 h-4 w-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center justify-center rounded-md py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <User className="mr-2 h-4 w-4" />
              Personal Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4 mt-4">
            {/* Weekly Trends and Location Analysis */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2 border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    Weekly Exposure Trends
                  </CardTitle>
                  <CardDescription>
                    PM2.5 and PM10 levels over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-80">
                    <ResponsiveLine
                      data={lineChartData}
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
                        legend: 'Day',
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
                      colors={{ scheme: 'set2' }}
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
              
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                    Exposure by Location
                  </CardTitle>
                  <CardDescription>
                    Where you experience the most pollution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsivePie
                      data={pieChartData}
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

            {/* Daily Pattern and Heatmap */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    Daily Pattern
                  </CardTitle>
                  <CardDescription>Time of day exposure analysis</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-80">
                    <ResponsiveLine
                      data={hourlyChartData}
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
              
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    Exposure Heatmap
                  </CardTitle>
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

            {/* Recommendations */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2 text-blue-500" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>
                  Based on your exposure patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.slice(0, 4).map((rec) => (
                    <div key={rec.id} className="flex items-start space-x-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <Badge 
                        variant={getRecommendationVariant(rec.category)} 
                        className="mt-0.5 shrink-0"
                      >
                        {rec.category}
                      </Badge>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{rec.text}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                          <CalendarDays className="h-3 w-3 inline mr-1" />
                          {rec.route}
                          {rec.priority === 'High' && (
                            <Badge variant="outline" className="ml-2 py-0 text-[10px] h-4 bg-amber-50 border-amber-200 text-amber-700">
                              High Priority
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Apply</Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline">
                    View All Recommendations
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="map" className="mt-4">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Map className="h-5 w-5 mr-2 text-blue-500" />
                  Air Quality Map
                </CardTitle>
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
                    <Button className="mt-4">Load Map Data</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t flex justify-between items-center">
                <div className="text-sm text-slate-500">
                  Last updated: Today, 10:45 AM
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Map Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="personal" className="mt-4">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  Personal Insights
                </CardTitle>
                <CardDescription>
                  Tailored analysis of your exposure patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                      Exposure Summary
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-slate-500">Daily Average</div>
                        <div className="text-2xl font-bold mt-1">
                          {exposureSummary?.dailyAverage.toFixed(1) || 78} μg/m³
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          {exposureSummary?.exposureAboveWHO || '156%'} of WHO guideline
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-slate-500">Weekly Trend</div>
                        <div className="text-2xl font-bold mt-1 flex items-center">
                          {exposureSummary?.weeklyTrendDirection === 'up' ? (
                            <ArrowUpRight className="mr-1 h-5 w-5 text-red-500" />
                          ) : (
                            <ArrowDownRight className="mr-1 h-5 w-5 text-green-500" />
                          )}
                          {exposureSummary?.weeklyTrend || '+12%'}
                        </div>
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
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-blue-500" />
                      Health Impact Assessment
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm">
                        Based on your exposure patterns, your current air pollution exposure may contribute to:
                      </div>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        {healthImpacts.map((impact, index) => (
                          <li key={index}>{impact}</li>
                        ))}
                      </ul>
                      <div className="mt-3 text-sm">
                        <strong>Note:</strong> Following the recommended actions could reduce your health risks by up to 35%.
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      Long-term Analysis
                    </h3>
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
              <CardFooter className="bg-slate-50 border-t flex justify-between">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button>
                  Schedule Health Consultation
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t bg-background p-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Wind className="h-4 w-4 text-blue-500" />
          NepalAir Personal Exposure Monitoring — Helping you breathe easier © 2023
        </div>
      </footer>
    </div>
  )
}