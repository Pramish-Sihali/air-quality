// types/routes.ts
export type TransportMode = 'walking' | 'cycling' | 'car' | 'public_transport' | 'other';
export type Frequency = 'daily' | 'weekdays' | 'weekends' | 'occasionally';
export type HealthSensitivity = 'low' | 'medium' | 'high';

export interface LocationCoordinates {
  location: string;
  coordinates: { lat: number; lng: number };
}

export interface Route {
  id: string;
  name: string;
  start: LocationCoordinates;
  end: LocationCoordinates;
  via?: LocationCoordinates[];
  frequency: Frequency;
  departureTime?: string;
  returnTime?: string;
  transportMode: TransportMode;
  active: boolean;
}

export interface UserProfile {
  name: string;
  email?: string;
  homeLocation: LocationCoordinates;
  workLocation?: LocationCoordinates;
  routes: Route[];
  healthSensitivity?: HealthSensitivity;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    thresholdAQI: number;
  };
}

// Sample location data from Kathmandu
export const kathmandu_locations = [
  { location: "Thamel", coordinates: { lat: 27.7172, lng: 85.3082 }, pm25_avg: 38.5, pm10_avg: 68.7 },
  { location: "Kalanki", coordinates: { lat: 27.6939, lng: 85.2809 }, pm25_avg: 115.0, pm10_avg: 177.5 },
  { location: "Balaju", coordinates: { lat: 27.7361, lng: 85.3031 }, pm25_avg: 80.0, pm10_avg: 120.0 },
  { location: "Bhaktapur", coordinates: { lat: 27.6711, lng: 85.4298 }, pm25_avg: 28.5, pm10_avg: 50.0 },
  { location: "Lalitpur", coordinates: { lat: 27.6588, lng: 85.3247 }, pm25_avg: 16.5, pm10_avg: 30.0 },
  { location: "Koteshwor", coordinates: { lat: 27.6796, lng: 85.3497 }, pm25_avg: 148.0, pm10_avg: 202.5 },
  { location: "Patan", coordinates: { lat: 27.6742, lng: 85.3240 }, pm25_avg: 27.5, pm10_avg: 51.5 },
  { location: "Ratnapark", coordinates: { lat: 27.7041, lng: 85.3131 }, pm25_avg: 85.0, pm10_avg: 120.0 },
  { location: "Chabahil", coordinates: { lat: 27.7197, lng: 85.3429 }, pm25_avg: 68.0, pm10_avg: 95.0 },
  { location: "Swayambhu", coordinates: { lat: 27.7147, lng: 85.2896 }, pm25_avg: 105.0, pm10_avg: 145.0 },
  { location: "Budhanilkantha", coordinates: { lat: 27.7784, lng: 85.3618 }, pm25_avg: 32.0, pm10_avg: 60.0 },
  { location: "Kirtipur", coordinates: { lat: 27.6818, lng: 85.2884 }, pm25_avg: 25.0, pm10_avg: 48.0 },
  { location: "Godavari", coordinates: { lat: 27.5965, lng: 85.3782 }, pm25_avg: 15.0, pm10_avg: 28.0 }
];

// Default profile when none exists
export const defaultProfile: UserProfile = {
  name: "Guest User",
  homeLocation: {
    location: "Thamel",
    coordinates: { lat: 27.7172, lng: 85.3082 }
  },
  routes: [],
  healthSensitivity: "medium",
  notificationPreferences: {
    email: false,
    push: true,
    thresholdAQI: 100
  }
};