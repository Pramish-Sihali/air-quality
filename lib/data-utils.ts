// Type definitions for our data
export interface ExposureRecord {
  date: string;
  pm25: number;
  pm10: number;
  location: string;
  aqiCategory: string;
}

export interface HourlyExposure {
  time: string;
  pm25: number;
  pm10: number;
  location: string;
  date: string;
}

export interface LocationData {
  location: string;
  pm25_avg: number;
  pm10_avg: number;
  exposure_minutes: number;
  latitude: number;
  longitude: number;
}

export interface WeeklyPattern {
  day: string;
  time_range: string;
  pm25: number;
  pm10: number;
  location: string;
}

export interface Recommendation {
  id: number;
  text: string;
  category: string;
  route: string;
  priority: string;
  impact_score: number;
}

export interface Alert {
  id: number;
  title: string;
  message: string;
  time: string;
  severity: string;
  location: string;
}

// Define an interface for summary data
export interface ExposureSummary {
  dailyAverage: number;
  weeklyTrend: string;
  weeklyTrendDirection: 'up' | 'down';
  highestValue: number;
  highestLocation: string;
  exposureAboveWHO: string;
  currentAqi?: number;
}

// Define an interface for highest exposure data
export interface HighestExposureData {
  location: string;
  time: string;
  value: number;
}

// Custom CSV parsing without PapaParse
export async function loadCSV<T>(filename: string): Promise<T[]> {
  try {
    const response = await fetch(filename);
    const csvText = await response.text();
    
    // Split the CSV text into lines
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      return [];
    }
    
    // Get headers from the first line
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Parse data rows
    const data = lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      const row: Record<string, unknown> = {};
      
      headers.forEach((header, index) => {
        // Try to convert numerical values
        const value = values[index];
        row[header] = convertValueType(value);
      });
      
      return row as unknown as T;
    });
    
    return data;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}

// Helper to parse CSV line considering quotes
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Add the last value
  values.push(currentValue.trim());
  
  return values;
}

// Convert string values to appropriate types
function convertValueType(value: string): unknown {
  // Remove quotes if present
  const trimmedValue = value.replace(/^"|"$/g, '').trim();
  
  // Empty string remains empty string
  if (trimmedValue === '') {
    return '';
  }
  
  // Try to convert to number
  const numberValue = Number(trimmedValue);
  if (!isNaN(numberValue)) {
    return numberValue;
  }
  
  // Check for boolean
  if (trimmedValue.toLowerCase() === 'true') return true;
  if (trimmedValue.toLowerCase() === 'false') return false;
  
  // Otherwise, return as string
  return trimmedValue;
}

// Convert exposure data to Recharts line chart format
export function convertToLineChartData(data: ExposureRecord[]) {
  if (!data || data.length === 0) return [];
  
  // For Recharts, we need to structure data differently
  const chartData = data.map(record => ({
    date: record.date,
    'PM2.5': record.pm25,
    'PM10': record.pm10,
    name: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));
  
  return chartData;
}

// Convert hourly data to Recharts line chart format
export function convertHourlyToChartData(data: HourlyExposure[]) {
  if (!data || data.length === 0) return [];
  
  return data.map(record => ({
    name: record.time,
    value: record.pm25,
    hour: record.time,
    pm25: record.pm25,
    pm10: record.pm10
  }));
}

// Convert location data to pie chart format
export function convertToPieChartData(data: LocationData[]) {
  if (!data || data.length === 0) return [];
  
  return data.map(record => ({
    id: record.location,
    name: record.location,
    value: record.pm25_avg
  }));
}

// Convert weekly pattern to heatmap format
export function convertToHeatmapData(data: WeeklyPattern[]) {
  if (!data || data.length === 0) return [];
  
  const days = Array.from(new Set(data.map(item => item.day)));
  
  return days.map(day => {
    const dayData = data.filter(item => item.day === day);
    return {
      id: day,
      data: dayData.map(item => ({
        x: item.time_range,
        y: item.pm25,
        value: item.pm25,
        day: day,
        time: item.time_range,
        location: item.location
      }))
    };
  });
}

// Calculate exposure summary statistics
export function calculateExposureSummary(data: ExposureRecord[]): ExposureSummary | null {
  if (!data.length) return null;
  
  const dailyAverage = data.reduce((sum, day) => sum + day.pm25, 0) / data.length;
  const sortedByPM25 = [...data].sort((a, b) => b.pm25 - a.pm25);
  const highestValue = sortedByPM25[0].pm25;
  const highestLocation = sortedByPM25[0].location;
  
  // Calculate the trend compared to last week
  // For simplicity, assuming first half of data is "last week" and second half is "this week"
  const midpoint = Math.floor(data.length / 2);
  const lastWeekAvg = data.slice(0, midpoint).reduce((sum, day) => sum + day.pm25, 0) / midpoint;
  const thisWeekAvg = data.slice(midpoint).reduce((sum, day) => sum + day.pm25, 0) / (data.length - midpoint);
  const weeklyTrendPercent = ((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100;
  
  // Calculate current AQI based on the most recent day's data
  const mostRecentDay = data.slice(-1)[0];
  const currentAqi = mostRecentDay ? Math.round(mostRecentDay.pm25 * 2.1) : undefined;
  
  return {
    dailyAverage,
    weeklyTrend: weeklyTrendPercent.toFixed(1) + '%',
    weeklyTrendDirection: weeklyTrendPercent >= 0 ? 'up' : 'down',
    highestValue,
    highestLocation,
    exposureAboveWHO: ((dailyAverage / 25) * 100).toFixed(0) + '%',
    currentAqi
  };
}

// Get color based on AQI level
export function getAqiColor(value: number): string {
  if (value <= 50) return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
  if (value <= 100) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
  if (value <= 150) return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
  if (value <= 200) return 'bg-red-100 text-red-800 hover:bg-red-200';
  if (value <= 300) return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
  return 'bg-rose-100 text-rose-800 hover:bg-rose-200';
}

export function getAqiText(value: number): string {
  if (value <= 50) return 'Good';
  if (value <= 100) return 'Moderate';
  if (value <= 150) return 'Unhealthy for Sensitive Groups';
  if (value <= 200) return 'Unhealthy';
  if (value <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

// Get badge variant based on recommendation category
export function getRecommendationVariant(category: string): 'default' | 'destructive' | 'secondary' | 'outline' {
  switch (category) {
    case 'Critical': return 'destructive';
    case 'Health': return 'default';
    case 'Route': return 'secondary';
    case 'Home': return 'outline';
    case 'Environment': return 'secondary';
    default: return 'default';
  }
}

// Get badge color based on alert severity
export function getAlertSeverityColor(severity: string): string {
  switch (severity) {
    case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'Warning': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Info': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
}

// Get the highest exposure time and location from hourly data
export function getHighestExposureData(data: HourlyExposure[]): HighestExposureData | null {
  if (!data.length) return null;
  
  const sorted = [...data].sort((a, b) => b.pm25 - a.pm25);
  const highest = sorted[0];
  
  return {
    location: highest.location,
    time: highest.time,
    value: highest.pm25
  };
}

// Get critical alert if any exist
export function getCriticalAlert(alerts: Alert[]): Alert | undefined {
  return alerts.find(alert => alert.severity === 'Critical');
}

// Generate health impact assessment based on exposure data
export function generateHealthImpactAssessment(exposureSummary: ExposureSummary): string[] {
  if (!exposureSummary) return [];
  
  const impacts: string[] = [];
  
  if (exposureSummary.dailyAverage > 35) {
    impacts.push('Increased risk of respiratory symptoms');
  }
  
  if (exposureSummary.dailyAverage > 50) {
    impacts.push('Potential aggravation of existing conditions');
  }
  
  if (exposureSummary.dailyAverage > 75) {
    impacts.push('Long-term cardiovascular stress if sustained');
  }
  
  if (exposureSummary.dailyAverage > 100) {
    impacts.push('Significantly increased risk of respiratory infections');
    impacts.push('Reduced lung function during physical activity');
  }
  
  return impacts;
}