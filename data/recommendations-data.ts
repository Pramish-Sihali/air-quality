// Import icon types we need
import { Lungs } from '@/components/icons';
import { 
    Activity, 
    MapPin, 
    Home, 
    Wind, 
    TrendingUp, 
    AlertCircle, 
    Heart, 
    Moon,
    LucideIcon,
    HeartPulse 
  } from 'lucide-react';
  import { SVGProps } from 'react';
  
 
  
  // Health impact data
  export interface HealthImpactItem {
    name: string;
    current: number;
    recommended: number;
    icon: LucideIcon ;
  }
  
  export const healthImpactData: HealthImpactItem[] = [
    { name: 'Respiratory', current: 75, recommended: 25, icon: HeartPulse  },
    { name: 'Cardiovascular', current: 65, recommended: 30, icon: Heart },
    { name: 'General Wellbeing', current: 60, recommended: 20, icon: Activity },
    { name: 'Sleep Quality', current: 55, recommended: 15, icon: Moon },
    { name: 'Physical Activity', current: 70, recommended: 30, icon: TrendingUp },
  ];
  
  // Recommendation data
  export interface Recommendation {
    id: number;
    text: string;
    category: string;
    route: string;
    icon: LucideIcon;
  }
  
  export const recommendations: Recommendation[] = [
    { id: 1, text: 'Consider using an N95 mask during your morning commute to Kalanki', category: 'Critical', route: 'Home to Office', icon: HeartPulse  },
    { id: 2, text: 'Schedule outdoor exercise before 9 AM when pollution levels are lower', category: 'Health', route: 'Daily Routine', icon: Activity },
    { id: 3, text: 'Alternative route via Lalitpur reduces your PM2.5 exposure by 45%', category: 'Route', route: 'Office to Home', icon: MapPin },
    { id: 4, text: 'Close windows during evening hours (6-8 PM) when pollution spikes', category: 'Home', route: 'Indoor Air', icon: Home },
    { id: 5, text: 'Use air purifier at home between 7-9 PM during peak pollution hours', category: 'Critical', route: 'Home', icon: Wind },
    { id: 6, text: 'Consider wearing a mask when visiting Kalanki area this weekend', category: 'Health', route: 'Weekend Plans', icon: HeartPulse  },
    { id: 7, text: 'Check air quality forecast before your planned hike on Saturday', category: 'Health', route: 'Recreation', icon: TrendingUp },
    { id: 8, text: 'Your office area has 32% higher PM2.5 than your residence - consider discussing air filtration', category: 'Critical', route: 'Workplace', icon: AlertCircle },
  ];
  
  // News and alerts data
  export interface NewsItem {
    id: number;
    title: string;
    date: string;
    summary: string;
    category: string;
    source: string;
  }
  
  export const airQualityNews: NewsItem[] = [
    { id: 1, title: 'New Air Quality Monitoring Station Installed', date: '2023-04-05', summary: 'A new monitoring station has been installed in Kirtipur to improve air quality data coverage', category: 'Infrastructure', source: 'Department of Environment' },
    { id: 2, title: 'Study Links Air Pollution to Increased Respiratory Issues', date: '2023-04-02', summary: 'A recent study conducted in Kathmandu Valley shows significant correlation between PM2.5 levels and respiratory hospital admissions', category: 'Health', source: 'Journal of Environmental Health' },
    { id: 3, title: 'Government Announces New Emission Standards', date: '2023-03-28', summary: 'Nepal government has announced stricter emission standards for vehicles and industrial facilities starting next month', category: 'Policy', source: 'Ministry of Environment' },
    { id: 4, title: 'Air Quality Expected to Worsen in Coming Days', date: '2023-04-06', summary: 'Meteorological forecasts indicate conditions favorable for pollution accumulation over the next 3-5 days', category: 'Forecast', source: 'Department of Meteorology' },
    { id: 5, title: 'Free Mask Distribution Program Launched', date: '2023-04-01', summary: 'Local authorities have launched a program to distribute N95 masks to vulnerable populations in high-pollution areas', category: 'Public Health', source: 'Kathmandu Metropolitan City' },
  ];
  
  // Alerts data
  export interface Alert {
    id: number;
    title: string;
    message: string;
    time: string;
    severity: string;
  }
  
  export const recentAlerts: Alert[] = [
    { id: 1, title: 'High Pollution Alert', message: 'PM2.5 levels exceeding 150 μg/m³ near your home', time: '30 minutes ago', severity: 'high' },
    { id: 2, title: 'Route Warning', message: 'Heavy congestion on your regular route - air quality degraded', time: '2 hours ago', severity: 'medium' },
    { id: 3, title: 'Weather Advisory', message: 'Strong winds expected tomorrow may improve air quality', time: '4 hours ago', severity: 'low' },
    { id: 4, title: 'Exposure Notification', message: 'You spent 2.5 hours in unhealthy air quality today', time: '6 hours ago', severity: 'medium' },
  ];