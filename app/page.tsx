// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Scatter, ScatterChart, ZAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  CalendarDays,
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
  Home,
  TrendingUp,
  BarChart2,
  Activity,
  Search,
  FileText,
  Download,
  Share2,
  Layers,
  Thermometer,
  Droplets,
  Sun,
  Heart,
  Leaf,
  Info,
  Mail,
  Menu,
  X,
  ChevronDown,
  LogOut,
  UserPlus,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'

// Custom component for Lungs icon that's missing from lucide-react
const Lungs = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.081 20c2.633 0 4-2.5 4-6 0-5-1-10-4-10C4.52 4 4 5.5 4 7c0 1 .811 3.657 1.081 5.5C5.516 14 5.5 20 6.081 20Z" />
      <path d="M17.92 20c-2.633 0-4-2.5-4-6 0-5 1-10 4-10 1.561 0 2.081 1.5 2.081 3 0 1-.811 3.657-1.081 5.5C18.485 14 18.5 20 17.92 20Z" />
      <path d="M12 12a3 3 0 0 0-3-3v10" />
      <path d="M12 12a3 3 0 0 1 3-3v10" />
      <path d="M7 17.899A5 5 0 0 1 12 22v-5" />
      <path d="M17 17.899A5 5 0 0 0 12 22v-5" />
      <path d="M7 5c3 0 5 1 5 5" />
      <path d="M17 5c-3 0-5 1-5 5" />
    </svg>
  );
};

// Custom component for Moon icon
const Moon = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
  );
};

// Enhanced dummy data
// Sample historical exposure data
const exposureHistory = [
  { date: '2023-04-01', pm25: 35, pm10: 65, aqi: 68, o3: 45, no2: 22, so2: 12, location: 'Thamel', aqiCategory: 'Moderate', temperature: 25, humidity: 50, windSpeed: 10 },
  { date: '2023-04-02', pm25: 22, pm10: 45, aqi: 52, o3: 38, no2: 18, so2: 8, location: 'Patan', aqiCategory: 'Good', temperature: 27, humidity: 45, windSpeed: 12 },
  { date: '2023-04-03', pm25: 120, pm10: 180, aqi: 172, o3: 60, no2: 45, so2: 38, location: 'Kalanki', aqiCategory: 'Unhealthy', temperature: 29, humidity: 60, windSpeed: 8 },
  { date: '2023-04-04', pm25: 85, pm10: 125, aqi: 140, o3: 55, no2: 38, so2: 25, location: 'Balaju', aqiCategory: 'Unhealthy for Sensitive Groups', temperature: 26, humidity: 55, windSpeed: 15 },
  { date: '2023-04-05', pm25: 28, pm10: 52, aqi: 58, o3: 40, no2: 20, so2: 10, location: 'Bhaktapur', aqiCategory: 'Moderate', temperature: 24, humidity: 62, windSpeed: 9 },
  { date: '2023-04-06', pm25: 18, pm10: 32, aqi: 48, o3: 35, no2: 15, so2: 5, location: 'Lalitpur', aqiCategory: 'Good', temperature: 23, humidity: 58, windSpeed: 11 },
  { date: '2023-04-07', pm25: 156, pm10: 210, aqi: 198, o3: 70, no2: 52, so2: 42, location: 'Koteshwor', aqiCategory: 'Very Unhealthy', temperature: 30, humidity: 65, windSpeed: 6 },
  { date: '2023-04-08', pm25: 45, pm10: 78, aqi: 82, o3: 48, no2: 26, so2: 14, location: 'Basantapur', aqiCategory: 'Moderate', temperature: 26, humidity: 55, windSpeed: 10 },
  { date: '2023-04-09', pm25: 68, pm10: 95, aqi: 110, o3: 52, no2: 32, so2: 20, location: 'Chabahil', aqiCategory: 'Unhealthy for Sensitive Groups', temperature: 28, humidity: 52, windSpeed: 12 },
  { date: '2023-04-10', pm25: 32, pm10: 60, aqi: 65, o3: 42, no2: 24, so2: 16, location: 'Budhanilkantha', aqiCategory: 'Moderate', temperature: 25, humidity: 58, windSpeed: 8 },
  { date: '2023-04-11', pm25: 105, pm10: 145, aqi: 158, o3: 62, no2: 40, so2: 30, location: 'Swayambhu', aqiCategory: 'Unhealthy', temperature: 29, humidity: 60, windSpeed: 9 },
  { date: '2023-04-12', pm25: 25, pm10: 48, aqi: 55, o3: 40, no2: 18, so2: 10, location: 'Kirtipur', aqiCategory: 'Moderate', temperature: 27, humidity: 50, windSpeed: 11 },
  { date: '2023-04-13', pm25: 15, pm10: 28, aqi: 42, o3: 32, no2: 12, so2: 6, location: 'Godavari', aqiCategory: 'Good', temperature: 24, humidity: 65, windSpeed: 13 },
  { date: '2023-04-14', pm25: 92, pm10: 130, aqi: 145, o3: 58, no2: 36, so2: 26, location: 'Sankhu', aqiCategory: 'Unhealthy for Sensitive Groups', temperature: 28, humidity: 55, windSpeed: 10 },
];

const weeklyData = [
  { day: 'Mon', PM25: 35, PM10: 65, AQI: 68, NO2: 22, SO2: 12, O3: 45 },
  { day: 'Tue', PM25: 22, PM10: 45, AQI: 52, NO2: 18, SO2: 8, O3: 38 },
  { day: 'Wed', PM25: 120, PM10: 180, AQI: 172, NO2: 45, SO2: 38, O3: 60 },
  { day: 'Thu', PM25: 85, PM10: 125, AQI: 140, NO2: 38, SO2: 25, O3: 55 },
  { day: 'Fri', PM25: 28, PM10: 52, AQI: 58, NO2: 20, SO2: 10, O3: 40 },
  { day: 'Sat', PM25: 18, PM10: 32, AQI: 48, NO2: 15, SO2: 5, O3: 35 },
  { day: 'Sun', PM25: 42, PM10: 78, AQI: 82, NO2: 26, SO2: 14, O3: 48 },
];

const hourlyExposureData = [
  { time: '6am', value: 15, temperature: 20, humidity: 65 },
  { time: '8am', value: 85, temperature: 22, humidity: 60 },
  { time: '10am', value: 60, temperature: 24, humidity: 55 },
  { time: '12pm', value: 45, temperature: 26, humidity: 50 },
  { time: '2pm', value: 30, temperature: 28, humidity: 45 },
  { time: '4pm', value: 55, temperature: 27, humidity: 48 },
  { time: '6pm', value: 95, temperature: 25, humidity: 52 },
  { time: '8pm', value: 40, temperature: 23, humidity: 58 },
  { time: '10pm', value: 25, temperature: 22, humidity: 62 },
  { time: '12am', value: 20, temperature: 21, humidity: 65 },
  { time: '2am', value: 12, temperature: 20, humidity: 68 },
  { time: '4am', value: 10, temperature: 19, humidity: 70 },
];

const exposureByLocation = [
  { name: 'Thamel', value: 35, fill: '#0088FE' },
  { name: 'Kalanki', value: 120, fill: '#00C49F' },
  { name: 'Balaju', value: 85, fill: '#FFBB28' },
  { name: 'Bhaktapur', value: 28, fill: '#FF8042' },
  { name: 'Lalitpur', value: 18, fill: '#8884d8' },
  { name: 'Koteshwor', value: 156, fill: '#82ca9d' },
  { name: 'Chabahil', value: 68, fill: '#ffc658' },
  { name: 'Swayambhu', value: 105, fill: '#a4de6c' },
];

// Transform heatmap data for recharts
const heatmapData = [
  { name: '6-9 AM', Mon: 78, Tue: 56, Wed: 110, Thu: 92, Fri: 36, Sat: 25, Sun: 42 },
  { name: '9-12 PM', Mon: 55, Tue: 32, Wed: 98, Thu: 76, Fri: 29, Sat: 18, Sun: 38 },
  { name: '12-3 PM', Mon: 43, Tue: 25, Wed: 85, Thu: 64, Fri: 25, Sat: 15, Sun: 30 },
  { name: '3-6 PM', Mon: 91, Tue: 47, Wed: 132, Thu: 110, Fri: 47, Sat: 30, Sun: 55 },
  { name: '6-9 PM', Mon: 81, Tue: 52, Wed: 142, Thu: 89, Fri: 38, Sat: 35, Sun: 65 },
];

const monthlyTrendData = [
  { month: 'Jan', PM25: 45, PM10: 75, AQI: 80 },
  { month: 'Feb', PM25: 58, PM10: 95, AQI: 105 },
  { month: 'Mar', PM25: 78, PM10: 118, AQI: 125 },
  { month: 'Apr', PM25: 92, PM10: 140, AQI: 150 },
  { month: 'May', PM25: 65, PM10: 105, AQI: 110 },
  { month: 'Jun', PM25: 42, PM10: 70, AQI: 85 },
  { month: 'Jul', PM25: 35, PM10: 60, AQI: 70 },
  { month: 'Aug', PM25: 30, PM10: 55, AQI: 65 },
  { month: 'Sep', PM25: 48, PM10: 80, AQI: 95 },
  { month: 'Oct', PM25: 62, PM10: 100, AQI: 110 },
  { month: 'Nov', PM25: 75, PM10: 120, AQI: 130 },
  { month: 'Dec', PM25: 55, PM10: 90, AQI: 100 },
];

const weatherTrendData = [
  { month: 'Jan', temperature: 12, humidity: 55, precipitation: 5 },
  { month: 'Feb', temperature: 14, humidity: 50, precipitation: 10 },
  { month: 'Mar', temperature: 18, humidity: 45, precipitation: 15 },
  { month: 'Apr', temperature: 22, humidity: 40, precipitation: 20 },
  { month: 'May', temperature: 25, humidity: 55, precipitation: 60 },
  { month: 'Jun', temperature: 27, humidity: 70, precipitation: 120 },
  { month: 'Jul', temperature: 28, humidity: 85, precipitation: 200 },
  { month: 'Aug', temperature: 27, humidity: 80, precipitation: 180 },
  { month: 'Sep', temperature: 26, humidity: 75, precipitation: 100 },
  { month: 'Oct', temperature: 22, humidity: 60, precipitation: 40 },
  { month: 'Nov', temperature: 18, humidity: 50, precipitation: 15 },
  { month: 'Dec', temperature: 14, humidity: 55, precipitation: 5 },
];

const recommendations = [
  { id: 1, text: 'Consider using an N95 mask during your morning commute to Kalanki', category: 'Critical', route: 'Home to Office', icon: Lungs },
  { id: 2, text: 'Schedule outdoor exercise before 9 AM when pollution levels are lower', category: 'Health', route: 'Daily Routine', icon: Activity },
  { id: 3, text: 'Alternative route via Lalitpur reduces your PM2.5 exposure by 45%', category: 'Route', route: 'Office to Home', icon: MapPin },
  { id: 4, text: 'Close windows during evening hours (6-8 PM) when pollution spikes', category: 'Home', route: 'Indoor Air', icon: Home },
  { id: 5, text: 'Use air purifier at home between 7-9 PM during peak pollution hours', category: 'Critical', route: 'Home', icon: Wind },
  { id: 6, text: 'Consider wearing a mask when visiting Kalanki area this weekend', category: 'Health', route: 'Weekend Plans', icon: Lungs },
  { id: 7, text: 'Check air quality forecast before your planned hike on Saturday', category: 'Health', route: 'Recreation', icon: TrendingUp },
  { id: 8, text: 'Your office area has 32% higher PM2.5 than your residence - consider discussing air filtration', category: 'Critical', route: 'Workplace', icon: AlertCircle },
];

const airQualityMonitoringStations = [
  { id: 1, name: 'US Embassy', location: 'Maharajgunj', status: 'Active', lastUpdate: '15 min ago', pm25: 65, pm10: 90, aqi: 112, lat: 27.7172, lng: 85.3240 },
  { id: 2, name: 'Ratnapark', location: 'City Center', status: 'Active', lastUpdate: '10 min ago', pm25: 85, pm10: 120, aqi: 138, lat: 27.7041, lng: 85.3131 },
  { id: 3, name: 'Pulchowk', location: 'Lalitpur', status: 'Active', lastUpdate: '20 min ago', pm25: 42, pm10: 68, aqi: 78, lat: 27.6778, lng: 85.3187 },
  { id: 4, name: 'Bhaktapur', location: 'Bhaktapur Durbar Square', status: 'Active', lastUpdate: '25 min ago', pm25: 38, pm10: 65, aqi: 75, lat: 27.6710, lng: 85.4298 },
  { id: 5, name: 'Kirtipur', location: 'Tribhuvan University', status: 'Maintenance', lastUpdate: '1 day ago', pm25: null, pm10: null, aqi: null, lat: 27.6818, lng: 85.2884 },
  { id: 6, name: 'Kalanki', location: 'Outer Ring Road', status: 'Active', lastUpdate: '30 min ago', pm25: 128, pm10: 185, aqi: 175, lat: 27.6939, lng: 85.2824 },
  { id: 7, name: 'Shankhapark', location: 'Kathmandu Center', status: 'Active', lastUpdate: '15 min ago', pm25: 75, pm10: 110, aqi: 125, lat: 27.7104, lng: 85.3093 },
  { id: 8, name: 'Dharan', location: 'Eastern Nepal', status: 'Active', lastUpdate: '40 min ago', pm25: 32, pm10: 55, aqi: 65, lat: 26.8065, lng: 87.2846 },
  { id: 9, name: 'Pokhara', location: 'Western Nepal', status: 'Active', lastUpdate: '45 min ago', pm25: 25, pm10: 42, aqi: 52, lat: 28.2096, lng: 83.9856 },
  { id: 10, name: 'Nepalgunj', location: 'Mid-Western Nepal', status: 'Inactive', lastUpdate: '2 days ago', pm25: null, pm10: null, aqi: null, lat: 28.0500, lng: 81.6167 },
  { id: 11, name: 'Dhulikhel', location: 'Kavrepalanchok', status: 'Active', lastUpdate: '35 min ago', pm25: 30, pm10: 58, aqi: 62, lat: 27.6225, lng: 85.5464 },
  { id: 12, name: 'Chitwan', location: 'National Park Area', status: 'Active', lastUpdate: '50 min ago', pm25: 28, pm10: 50, aqi: 58, lat: 27.5291, lng: 84.3542 },
];

const healthImpactData = [
  { name: 'Respiratory', current: 75, recommended: 25, icon: Lungs },
  { name: 'Cardiovascular', current: 65, recommended: 30, icon: Heart },
  { name: 'General Wellbeing', current: 60, recommended: 20, icon: Activity },
  { name: 'Sleep Quality', current: 55, recommended: 15, icon: Moon },
  { name: 'Physical Activity', current: 70, recommended: 30, icon: TrendingUp },
];

const radarData = [
  { subject: 'PM2.5', A: 120, B: 25, fullMark: 150 },
  { subject: 'PM10', A: 85, B: 50, fullMark: 150 },
  { subject: 'NO2', A: 35, B: 20, fullMark: 150 },
  { subject: 'SO2', A: 28, B: 15, fullMark: 150 },
  { subject: 'O3', A: 52, B: 30, fullMark: 150 },
  { subject: 'CO', A: 42, B: 25, fullMark: 150 },
];

// Kathmandu locations with AQI values
const kathmandu_locations = [
  { name: 'Thamel', lat: 27.7154, lng: 85.3123, aqi: 88, pm25: 35, pm10: 65 },
  { name: 'Kalanki', lat: 27.6939, lng: 85.2824, aqi: 190, pm25: 120, pm10: 180 },
  { name: 'Balaju', lat: 27.7362, lng: 85.3007, aqi: 145, pm25: 85, pm10: 125 },
  { name: 'Bhaktapur', lat: 27.6710, lng: 85.4298, aqi: 78, pm25: 28, pm10: 52 },
  { name: 'Lalitpur', lat: 27.6588, lng: 85.3247, aqi: 65, pm25: 18, pm10: 32 },
  { name: 'Koteshwor', lat: 27.6769, lng: 85.3497, aqi: 210, pm25: 156, pm10: 210 },
  { name: 'Chabahil', lat: 27.7197, lng: 85.3429, aqi: 110, pm25: 68, pm10: 95 },
  { name: 'Swayambhu', lat: 27.7147, lng: 85.2896, aqi: 160, pm25: 105, pm10: 145 },
  { name: 'Budhanilkantha', lat: 27.7784, lng: 85.3618, aqi: 62, pm25: 32, pm10: 60 },
  { name: 'Kirtipur', lat: 27.6818, lng: 85.2884, aqi: 55, pm25: 25, pm10: 48 },
  { name: 'Godavari', lat: 27.5965, lng: 85.3782, aqi: 42, pm25: 15, pm10: 28 },
  { name: 'Ratnapark', lat: 27.7041, lng: 85.3131, aqi: 138, pm25: 85, pm10: 120 },
  { name: 'Sankhu', lat: 27.7568, lng: 85.4597, aqi: 145, pm25: 92, pm10: 130 },
  { name: 'Chandragiri', lat: 27.6540, lng: 85.2081, aqi: 58, pm25: 25, pm10: 48 },
  { name: 'Tokha', lat: 27.7860, lng: 85.3306, aqi: 70, pm25: 38, pm10: 65 }
];

const personalExposurePoints = [
  { time: '8:00 AM', location: 'Home', aqi: 65, activity: 'Getting Ready', lat: 27.7197, lng: 85.3429 },
  { time: '8:30 AM', location: 'Commuting', aqi: 145, activity: 'Walking to Bus', lat: 27.7180, lng: 85.3400 },
  { time: '9:00 AM', location: 'Bus Stop', aqi: 190, activity: 'Waiting for Bus', lat: 27.7154, lng: 85.3350 },
  { time: '9:30 AM', location: 'Main Road', aqi: 210, activity: 'Bus Journey', lat: 27.7100, lng: 85.3250 },
  { time: '10:00 AM', location: 'Office Area', aqi: 160, activity: 'Walking to Office', lat: 27.7041, lng: 85.3131 },
  { time: '10:30 AM', location: 'Office', aqi: 75, activity: 'Working', lat: 27.7041, lng: 85.3131 },
  { time: '1:00 PM', location: 'Lunch Place', aqi: 110, activity: 'Lunch Break', lat: 27.7020, lng: 85.3150 },
  { time: '5:30 PM', location: 'Office', aqi: 85, activity: 'Leaving Office', lat: 27.7041, lng: 85.3131 },
  { time: '6:00 PM', location: 'Shopping', aqi: 125, activity: 'Grocery Shopping', lat: 27.7100, lng: 85.3200 },
  { time: '6:30 PM', location: 'Commuting', aqi: 180, activity: 'Bus Journey Home', lat: 27.7150, lng: 85.3300 },
  { time: '7:00 PM', location: 'Local Area', aqi: 155, activity: 'Walking Home', lat: 27.7180, lng: 85.3400 },
  { time: '7:30 PM', location: 'Home', aqi: 78, activity: 'Dinner', lat: 27.7197, lng: 85.3429 }
];

// News and alerts data
const airQualityNews = [
  { id: 1, title: 'New Air Quality Monitoring Station Installed', date: '2023-04-05', summary: 'A new monitoring station has been installed in Kirtipur to improve air quality data coverage', category: 'Infrastructure', source: 'Department of Environment' },
  { id: 2, title: 'Study Links Air Pollution to Increased Respiratory Issues', date: '2023-04-02', summary: 'A recent study conducted in Kathmandu Valley shows significant correlation between PM2.5 levels and respiratory hospital admissions', category: 'Health', source: 'Journal of Environmental Health' },
  { id: 3, title: 'Government Announces New Emission Standards', date: '2023-03-28', summary: 'Nepal government has announced stricter emission standards for vehicles and industrial facilities starting next month', category: 'Policy', source: 'Ministry of Environment' },
  { id: 4, title: 'Air Quality Expected to Worsen in Coming Days', date: '2023-04-06', summary: 'Meteorological forecasts indicate conditions favorable for pollution accumulation over the next 3-5 days', category: 'Forecast', source: 'Department of Meteorology' },
  { id: 5, title: 'Free Mask Distribution Program Launched', date: '2023-04-01', summary: 'Local authorities have launched a program to distribute N95 masks to vulnerable populations in high-pollution areas', category: 'Public Health', source: 'Kathmandu Metropolitan City' },
];

// Helper function to get color based on AQI level
const getAqiColor = (value: number | null) => {
  if (value === null) return 'bg-gray-100 text-gray-500 hover:bg-gray-200';
  if (value <= 50) return 'bg-green-100 text-green-800 hover:bg-green-200';
  if (value <= 100) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
  if (value <= 150) return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
  if (value <= 200) return 'bg-red-100 text-red-800 hover:bg-red-200';
  if (value <= 300) return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
  return 'bg-rose-100 text-rose-800 hover:bg-rose-200';
};

// Helper function to get AQI category
const getAqiCategory = (value: number | null) => {
  if (value === null) return 'Unknown';
  if (value <= 50) return 'Good';
  if (value <= 100) return 'Moderate';
  if (value <= 150) return 'Unhealthy for Sensitive Groups';
  if (value <= 200) return 'Unhealthy';
  if (value <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

// Helper function to get color hex code for map
const getAqiColorHex = (value: number | null) => {
  if (value === null) return '#CCCCCC';
  if (value <= 50) return '#00E400';
  if (value <= 100) return '#FFFF00';
  if (value <= 150) return '#FF7E00';
  if (value <= 200) return '#FF0000';
  if (value <= 300) return '#8F3F97';
  return '#7E0023';
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
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c'];
const BLUE_COLORS = ['#edf8fb', '#b2e2e2', '#66c2a4', '#2ca25f', '#006d2c'];

// Component for Kathmandu Map 
const KathmanduMap = () => {
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
};

export default function Dashboard() {
  const [currentAqi] = useState(156);
  const [exposure] = useState(78);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [recentAlerts] = useState([
    { id: 1, title: 'High Pollution Alert', message: 'PM2.5 levels exceeding 150 μg/m³ near your home', time: '30 minutes ago', severity: 'high' },
    { id: 2, title: 'Route Warning', message: 'Heavy congestion on your regular route - air quality degraded', time: '2 hours ago', severity: 'medium' },
    { id: 3, title: 'Weather Advisory', message: 'Strong winds expected tomorrow may improve air quality', time: '4 hours ago', severity: 'low' },
    { id: 4, title: 'Exposure Notification', message: 'You spent 2.5 hours in unhealthy air quality today', time: '6 hours ago', severity: 'medium' },
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

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, 'PPP');
  };
  
  // Get alert icon based on severity
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'low': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
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
                {formatDate(selectedDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
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
                    <div key={alert.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.severity)}
                        <div>
                          <div className="font-medium text-sm">{alert.title}</div>
                          <div className="text-xs text-gray-600 mt-1">{alert.message}</div>
                          <div className="text-xs text-gray-400 mt-1">{alert.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                <div className="p-2 text-center">
                  <Button variant="link" size="sm" className="text-xs">View All Notifications</Button>
                </div>
              </div>
            )}
          </div>
          
          <Button variant="outline" size="sm" className="hidden md:flex">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          
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
            <Button variant="ghost" size="sm" className="justify-start">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
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
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                          <Bar 
                            key={day} 
                            dataKey={day} 
                            fill={BLUE_COLORS[index % BLUE_COLORS.length]} 
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
          
          {/* Monitoring Stations Tab */}
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
  )
}