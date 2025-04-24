// types/air-quality.ts

// AQI Level Information
export interface AqiLevel {
    level: string;
    description: string;
    health_implications: string;
    color: string;
  }
  
  // Weather correlation 
  export interface WeatherCorrelation {
    parameter: string;
    correlation: number;
    effect: string;
    impact_level: string;
  }
  
  // Hourly forecast
  export interface HourlyForecast {
    hour: string;
    temperature: number;
    humidity: number;
    wind_speed: number;
    aqi_forecast: number;
  }
  
  // Seasonal pattern
  export interface SeasonalPattern {
    month: string;
    avg_temp: number;
    avg_humidity: number;
    avg_aqi: number;
  }
  
  // Current weather
  export interface CurrentWeather {
    temperature: number;
    humidity: number;
    wind_speed: number;
    wind_direction: string;
    precipitation: number;
    pressure: number;
    conditions: string;
  }
  
  // Weather data
  export interface WeatherData {
    current_weather: CurrentWeather;
    correlations: WeatherCorrelation[];
    hourly_forecast: HourlyForecast[];
    seasonal_patterns: SeasonalPattern[];
    aqi_levels_explanation: AqiLevel[];
  }
  
  // Route alternative
  export interface RouteAlternative {
    id: string;
    name: string;
    distance_km: number;
    avg_pm25: number;
    avg_pm10: number;
    exposure_time_mins: number;
    reduction_percent: number;
    extra_time_mins: number;
    total_exposure: number;
    exposure_reduction: number;
  }
  
  // Base route
  export interface BaseRoute {
    id: string;
    name: string;
    start: string;
    end: string;
    distance_km: number;
    avg_pm25: number;
    avg_pm10: number;
    exposure_time_mins: number;
    total_exposure: number;
  }
  
  // Route with alternatives
  export interface RouteWithAlternatives {
    base_route: BaseRoute;
    alternatives: RouteAlternative[];
  }
  
  // Location exposure data
  export interface LocationExposure {
    name: string;
    value: number;
  }
  
  // Hourly exposure data
  export interface HourlyExposure {
    time: string;
    value: number;
    temperature: number;
    humidity: number;
  }