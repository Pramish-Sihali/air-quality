// app/api/fast-air-quality/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = promisify(exec);

// Mock data generator function for fallback
function generateMockData() {
  const currentDate = new Date();
  
  return {
    success: true,
    message: 'Mock data generated due to API execution failure',
    fetchTime: 0.1,
    data: {
      current_aqi: {
        aqi: 156,
        city: "Kathmandu",
        timestamp: currentDate.toISOString(),
        pollutants: {
          pm25: 78,
          pm10: 125
        }
      },
      weekly_trend: [
        {"day": "Mon", "PM25": 65, "PM10": 110},
        {"day": "Tue", "PM25": 75, "PM10": 130},
        {"day": "Wed", "PM25": 90, "PM10": 145},
        {"day": "Thu", "PM25": 70, "PM10": 115},
        {"day": "Fri", "PM25": 55, "PM10": 95},
        {"day": "Sat", "PM25": 40, "PM10": 80},
        {"day": "Sun", "PM25": 85, "PM10": 140}
      ],
      locations: [
        {"name": "Thamel", "value": 65},
        {"name": "Kalanki", "value": 180},
        {"name": "Balaju", "value": 125},
        {"name": "Bhaktapur", "value": 80},
        {"name": "Lalitpur", "value": 55}
      ],
      hourly_exposure: [
        {"time": "6am", "value": 15, "temperature": 20, "humidity": 65},
        {"time": "8am", "value": 85, "temperature": 22, "humidity": 60},
        {"time": "10am", "value": 60, "temperature": 24, "humidity": 55},
        {"time": "12pm", "value": 45, "temperature": 26, "humidity": 50},
        {"time": "2pm", "value": 30, "temperature": 28, "humidity": 45},
        {"time": "4pm", "value": 55, "temperature": 27, "humidity": 48},
        {"time": "6pm", "value": 95, "temperature": 25, "humidity": 52},
        {"time": "8pm", "value": 40, "temperature": 23, "humidity": 58}
      ],
      route_optimization: generateRouteOptimizationData(),
      detailed_weather: generateDetailedWeatherData(),
      metadata: {
        last_updated: currentDate.toISOString(),
        fetch_time_seconds: 0.1,
        data_sources: {
          current_aqi: true,
          openaq: true,
          weather: true
        }
      }
    }
  };
}

// Helper function to generate route optimization data for fallback
function generateRouteOptimizationData() {
  // Base routes
  const baseRoutes = [
    {
      id: "route1",
      name: "Home to Office",
      start: "Thamel",
      end: "New Baneshwor",
      distance_km: 6.5,
      avg_pm25: 85,
      avg_pm10: 136,
      exposure_time_mins: 39,
      peak_hours_factor: 1.5,
      total_exposure: 331
    },
    {
      id: "route2",
      name: "Office to Gym",
      start: "New Baneshwor", 
      end: "Patan",
      distance_km: 4.2,
      avg_pm25: 72,
      avg_pm10: 115.2,
      exposure_time_mins: 25,
      peak_hours_factor: 1.0,
      total_exposure: 180
    },
    {
      id: "route3",
      name: "Weekend Shopping",
      start: "Thamel",
      end: "Bhatbhateni",
      distance_km: 3.8,
      avg_pm25: 90,
      avg_pm10: 144,
      exposure_time_mins: 22,
      peak_hours_factor: 1.0,
      total_exposure: 198
    }
  ];
  
  // Generate alternatives for each route
  return baseRoutes.map(route => {
    // Alternative 1: Less polluted but longer
    const alt1 = {
      id: `${route.id}_alt1`,
      name: `Alternative 1: Less polluted route`,
      distance_km: parseFloat((route.distance_km * 1.15).toFixed(1)),
      avg_pm25: Math.round(route.avg_pm25 * 0.65),
      avg_pm10: Math.round(route.avg_pm25 * 0.65 * 1.6),
      exposure_time_mins: Math.round(route.distance_km * 1.15 * 6),
      reduction_percent: 35,
      extra_time_mins: Math.round(route.distance_km * 1.15 * 6) - Math.round(route.distance_km * 6),
      total_exposure: Math.round(route.avg_pm25 * 0.65 * (route.distance_km * 1.15 * 6) / 10),
      exposure_reduction: route.total_exposure - Math.round(route.avg_pm25 * 0.65 * (route.distance_km * 1.15 * 6) / 10)
    };
    
    // Alternative 2: Same distance but different time
    const alt2 = {
      id: `${route.id}_alt2`,
      name: `Alternative 2: Travel during off-peak hours`,
      distance_km: route.distance_km,
      avg_pm25: Math.round(route.avg_pm25 * 0.75),
      avg_pm10: Math.round(route.avg_pm25 * 0.75 * 1.6),
      exposure_time_mins: Math.round(route.distance_km * 6),
      reduction_percent: 25,
      extra_time_mins: 0,
      total_exposure: Math.round(route.avg_pm25 * 0.75 * (route.distance_km * 6) / 10),
      exposure_reduction: route.total_exposure - Math.round(route.avg_pm25 * 0.75 * (route.distance_km * 6) / 10)
    };
    
    // Alternative 3: Different mode
    const alt3 = {
      id: `${route.id}_alt3`,
      name: `Alternative 3: Use different transport mode`,
      distance_km: route.distance_km,
      avg_pm25: Math.round(route.avg_pm25 * 0.5),
      avg_pm10: Math.round(route.avg_pm25 * 0.5 * 1.6),
      exposure_time_mins: Math.round(route.distance_km * 7),
      reduction_percent: 50,
      extra_time_mins: Math.round(route.distance_km * 7) - Math.round(route.distance_km * 6),
      total_exposure: Math.round(route.avg_pm25 * 0.5 * (route.distance_km * 7) / 10),
      exposure_reduction: route.total_exposure - Math.round(route.avg_pm25 * 0.5 * (route.distance_km * 7) / 10)
    };
    
    // Sort alternatives by exposure reduction
    const alternatives = [alt1, alt2, alt3].sort((a, b) => b.exposure_reduction - a.exposure_reduction);
    
    return {
      base_route: route,
      alternatives: alternatives
    };
  });
}

// Helper function to generate weather data for fallback
function generateDetailedWeatherData() {
  return {
    current_weather: {
      temperature: 28,
      humidity: 65,
      wind_speed: 8,
      wind_direction: "SE",
      precipitation: 40,
      pressure: 1012,
      conditions: "Partly cloudy"
    },
    correlations: [
      {
        parameter: "Temperature",
        correlation: 0.65,
        effect: "Higher temperatures generally increase pollutant concentrations due to increased photochemical reactions",
        impact_level: "High"
      },
      {
        parameter: "Wind Speed",
        correlation: -0.78,
        effect: "Higher wind speeds disperse pollutants, reducing concentrations",
        impact_level: "Very High"
      },
      {
        parameter: "Humidity",
        correlation: -0.42,
        effect: "Higher humidity can reduce some particulate matter, but increase others",
        impact_level: "Medium"
      },
      {
        parameter: "Precipitation",
        correlation: -0.85,
        effect: "Rain washes out particulate matter, significantly improving air quality",
        impact_level: "Very High"
      },
      {
        parameter: "Pressure",
        correlation: 0.32,
        effect: "High pressure systems can trap pollution near the ground",
        impact_level: "Medium"
      }
    ],
    hourly_forecast: [
      {hour: "6:00", temperature: 23, humidity: 75, wind_speed: 5, aqi_forecast: 45},
      {hour: "9:00", temperature: 25, humidity: 70, wind_speed: 6, aqi_forecast: 65},
      {hour: "12:00", temperature: 28, humidity: 65, wind_speed: 7, aqi_forecast: 85},
      {hour: "15:00", temperature: 30, humidity: 60, wind_speed: 8, aqi_forecast: 95},
      {hour: "18:00", temperature: 28, humidity: 65, wind_speed: 7, aqi_forecast: 110},
      {hour: "21:00", temperature: 25, humidity: 70, wind_speed: 6, aqi_forecast: 90}
    ],
    seasonal_patterns: [
      {month: "Jan", avg_temp: 12, avg_humidity: 55, avg_aqi: 180},
      {month: "Feb", avg_temp: 14, avg_humidity: 50, avg_aqi: 160},
      {month: "Mar", avg_temp: 18, avg_humidity: 45, avg_aqi: 150},
      {month: "Apr", avg_temp: 22, avg_humidity: 40, avg_aqi: 120},
      {month: "May", avg_temp: 25, avg_humidity: 55, avg_aqi: 100},
      {month: "Jun", avg_temp: 27, avg_humidity: 70, avg_aqi: 70},
      {month: "Jul", avg_temp: 28, avg_humidity: 85, avg_aqi: 50},
      {month: "Aug", avg_temp: 27, avg_humidity: 80, avg_aqi: 55},
      {month: "Sep", avg_temp: 26, avg_humidity: 75, avg_aqi: 65},
      {month: "Oct", avg_temp: 22, avg_humidity: 60, avg_aqi: 90},
      {month: "Nov", avg_temp: 18, avg_humidity: 50, avg_aqi: 130},
      {month: "Dec", avg_temp: 14, avg_humidity: 55, avg_aqi: 170}
    ],
    aqi_levels_explanation: [
      {
        level: "Good (0-50)",
        description: "Air quality is satisfactory, and air pollution poses little or no risk.",
        health_implications: "None for the general population.",
        color: "#00E400"
      },
      {
        level: "Moderate (51-100)",
        description: "Air quality is acceptable. However, some pollutants may be a concern for a small number of people.",
        health_implications: "Unusually sensitive individuals should consider limiting prolonged outdoor exertion.",
        color: "#FFFF00"
      },
      {
        level: "Unhealthy for Sensitive Groups (101-150)",
        description: "Members of sensitive groups may experience health effects.",
        health_implications: "People with respiratory or heart disease, the elderly and children should limit prolonged outdoor exertion.",
        color: "#FF7E00"
      },
      {
        level: "Unhealthy (151-200)",
        description: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
        health_implications: "People with respiratory or heart disease, the elderly and children should avoid prolonged outdoor exertion; everyone else should limit prolonged outdoor exertion.",
        color: "#FF0000"
      },
      {
        level: "Very Unhealthy (201-300)",
        description: "Health alert: everyone may experience more serious health effects.",
        health_implications: "People with respiratory or heart disease, the elderly and children should avoid any outdoor activity; everyone else should avoid prolonged outdoor exertion.",
        color: "#8F3F97"
      },
      {
        level: "Hazardous (301-500)",
        description: "Health warnings of emergency conditions. The entire population is more likely to be affected.",
        health_implications: "Everyone should avoid all outdoor exertion.",
        color: "#7E0023"
      }
    ]
  };
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const forceFresh = searchParams.get('force') === 'true';
    const useMock = searchParams.get('mock') === 'true';
    
    // If mock data is explicitly requested, return it immediately
    if (useMock) {
      console.log('Returning mock data as requested by query parameter');
      return NextResponse.json(generateMockData());
    }
    
    // Create directory paths to ensure they exist
    const dataDir = path.join(process.cwd(), 'data', 'api_data');
    try {
      // Recursively create data directories if they don't exist
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (err) {
      console.error('Error creating data directories:', err);
    }
    
    // Find the Python script - try multiple locations
    let pythonScriptPath = '';
    const possiblePaths = [
      path.join(process.cwd(), 'fast_air_quality.py'),
      path.join(process.cwd(), 'scripts', 'fast_air_quality.py'),
      path.join(process.cwd(), 'app', 'api', 'fast-air-quality', 'fast_air_quality.py'),
      path.join(process.cwd(), 'app', 'api', 'fast_air_quality.py')
    ];
    
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        pythonScriptPath = testPath;
        break;
      }
    }
    
    // If we can't find the script, generate and return mock data
    if (!pythonScriptPath) {
      console.error('Could not find the Python script - using mock data');
      return NextResponse.json(generateMockData());
    }
    
    // Try to execute the Python script with appropriate args
    // First try python3, then python if that fails
  
    let stderr = '';
    
    try {
      const command = `python3 "${pythonScriptPath}"${forceFresh ? ' --force' : ''}${useMock ? ' --mock' : ''}`;
      console.log(`Executing command: ${command}`);
      const result = await execPromise(command, { timeout: 15000 });
      
      stderr = result.stderr;
    } catch (pyError) {
      console.error('Error with python3 command, trying python:', pyError);
      
      try {
        const command = `python "${pythonScriptPath}"${forceFresh ? ' --force' : ''}${useMock ? ' --mock' : ''}`;
        console.log(`Executing command: ${command}`);
        const result = await execPromise(command, { timeout: 15000 });
   
        stderr = result.stderr;
      } catch (py2Error) {
        console.error('Both python and python3 commands failed:', py2Error);
        // Return mock data if all Python execution attempts fail
        return NextResponse.json(generateMockData());
      }
    }
    
    if (stderr && !stderr.includes("InsecureRequestWarning")) {
      console.warn('Warning from Python script:', stderr);
      // Continue anyway, we might have partial data
    }
    
    // Try to read the combined data file
    const dataPath = path.join(dataDir, 'combined_data.json');
    
    if (fs.existsSync(dataPath)) {
      try {
        const dataContent = fs.readFileSync(dataPath, 'utf-8');
        const data = JSON.parse(dataContent);
        
        return NextResponse.json({
          success: true,
          message: 'Data fetched successfully',
          fetchTime: data.metadata?.fetch_time_seconds || 0.1,
          data: data
        });
      } catch (readError) {
        console.error('Error reading data file:', readError);
        // Return mock data if we can't read the file
        return NextResponse.json(generateMockData());
      }
    } else {
      console.error('No data file available at:', dataPath);
      // If no data file, return mock data
      return NextResponse.json(generateMockData());
    }
  } catch (error) {
    console.error('Unexpected error processing request:', error);
    
    // Fall back to mock data in case of any error
    return NextResponse.json(generateMockData());
  }
}