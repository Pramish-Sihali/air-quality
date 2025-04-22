// Common constants and utility functions

// Helper function to get color based on AQI level
export const getAqiColor = (value: number | null): string => {
  if (value === null) return 'bg-gray-100 text-gray-500 hover:bg-gray-200';
  if (value <= 50) return 'bg-green-100 text-green-800 hover:bg-green-200';
  if (value <= 100) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
  if (value <= 150) return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
  if (value <= 200) return 'bg-red-100 text-red-800 hover:bg-red-200';
  if (value <= 300) return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
  return 'bg-rose-100 text-rose-800 hover:bg-rose-200';
};

// Helper function to get AQI category
export const getAqiCategory = (value: number | null): string => {
  if (value === null) return 'Unknown';
  if (value <= 50) return 'Good';
  if (value <= 100) return 'Moderate';
  if (value <= 150) return 'Unhealthy for Sensitive Groups';
  if (value <= 200) return 'Unhealthy';
  if (value <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

// Helper function to get color hex code for map
export const getAqiColorHex = (value: number | null): string => {
  if (value === null) return '#CCCCCC';
  if (value <= 50) return '#00E400';
  if (value <= 100) return '#FFFF00';
  if (value <= 150) return '#FF7E00';
  if (value <= 200) return '#FF0000';
  if (value <= 300) return '#8F3F97';
  return '#7E0023';
};

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export const getRecommendationColor = (category: string): BadgeVariant => {
  switch (category) {
    case 'Critical': return 'destructive';
    case 'Health': return 'default';
    case 'Route': return 'secondary';
    case 'Home': return 'outline';
    default: return 'default';
  }
};

// Generate custom heatmap colors based on value
export const getHeatmapCellColor = (value: number): string => {
  if (value <= 30) return '#edf8fb';
  if (value <= 60) return '#b2e2e2';
  if (value <= 90) return '#66c2a4';
  if (value <= 120) return '#2ca25f';
  return '#006d2c';
};

// Colors for the charts
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c'];
export const BLUE_COLORS = ['#edf8fb', '#b2e2e2', '#66c2a4', '#2ca25f', '#006d2c'];