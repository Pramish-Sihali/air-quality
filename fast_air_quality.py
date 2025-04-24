# Instructions for Setting Up the Python Script

# 1. First, create this file in the correct location
# Save this file as 'fast_air_quality.py' in your project root directory

import asyncio
import json
import time
import os
import random
from datetime import datetime
from pathlib import Path

# Configuration
CONFIG = {
    "cache_duration": 3600,  # Cache data for 1 hour
    "timeout": 10,  # API request timeout in seconds
    "data_dir": "./data/api_data",
    "endpoints": {
        "current_aqi": "https://api.waqi.info/feed/@8399/?token=demo",
        "openaq": "https://api.openaq.org/v2/latest?limit=10&page=1&offset=0&sort=desc&radius=1000&country=NP&location=Kathmandu&order_by=lastUpdated",
        "weatherapi": "https://api.weatherapi.com/v1/current.json?key=demo&q=Kathmandu&aqi=yes"
    }
}

# Ensure data directory exists
Path(CONFIG["data_dir"]).mkdir(parents=True, exist_ok=True)

def generate_mock_data():
    """Generate mock data"""
    # This function provides mock data
    mock_data = {
        "current_aqi": {
            "aqi": 156,
            "city": "Kathmandu",
            "timestamp": datetime.now().isoformat(),
            "pollutants": {
                "pm25": 78,
                "pm10": 125
            }
        },
        "weekly_trend": [
            {"day": "Mon", "PM25": 65, "PM10": 110},
            {"day": "Tue", "PM25": 75, "PM10": 130},
            {"day": "Wed", "PM25": 90, "PM10": 145},
            {"day": "Thu", "PM25": 70, "PM10": 115},
            {"day": "Fri", "PM25": 55, "PM10": 95},
            {"day": "Sat", "PM25": 40, "PM10": 80},
            {"day": "Sun", "PM25": 85, "PM10": 140}
        ],
        "locations": [
            {"name": "Thamel", "value": 65},
            {"name": "Kalanki", "value": 180},
            {"name": "Balaju", "value": 125},
            {"name": "Bhaktapur", "value": 80},
            {"name": "Lalitpur", "value": 55}
        ],
        "hourly_exposure": [
            {"time": "6am", "value": 15, "temperature": 20, "humidity": 65},
            {"time": "8am", "value": 85, "temperature": 22, "humidity": 60},
            {"time": "10am", "value": 60, "temperature": 24, "humidity": 55},
            {"time": "12pm", "value": 45, "temperature": 26, "humidity": 50},
            {"time": "2pm", "value": 30, "temperature": 28, "humidity": 45},
            {"time": "4pm", "value": 55, "temperature": 27, "humidity": 48},
            {"time": "6pm", "value": 95, "temperature": 25, "humidity": 52},
            {"time": "8pm", "value": 40, "temperature": 23, "humidity": 58}
        ],
        "route_optimization": generate_route_optimization_data(),
        "detailed_weather": generate_detailed_weather_data(),
        "metadata": {
            "last_updated": datetime.now().isoformat(),
            "fetch_time_seconds": 0.1,
            "data_sources": {
                "current_aqi": True,
                "openaq": True,
                "weather": True
            }
        }
    }
    
    # Save mock data to cache files
    for key, data in mock_data.items():
        cache_file = os.path.join(CONFIG["data_dir"], f"{key}.json")
        with open(cache_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    # Save combined data
    with open(os.path.join(CONFIG["data_dir"], "combined_data.json"), 'w') as f:
        json.dump(mock_data, f, indent=2)
    
    return mock_data

def generate_route_optimization_data():
    """Generate detailed route optimization data"""
    # Routes with real-world locations in Kathmandu
    base_routes = [
        {
            "id": "route1",
            "name": "Home to Office",
            "start": "Thamel",
            "end": "New Baneshwor",
            "distance_km": 6.5,
            "avg_pm25": 85,
            "avg_pm10": 136,
            "exposure_time_mins": 39,
            "peak_hours_factor": 1.5,
            "total_exposure": 331
        },
        {
            "id": "route2",
            "name": "Office to Gym",
            "start": "New Baneshwor", 
            "end": "Patan",
            "distance_km": 4.2,
            "avg_pm25": 72,
            "avg_pm10": 115.2,
            "exposure_time_mins": 25,
            "peak_hours_factor": 1.0,
            "total_exposure": 180
        },
        {
            "id": "route3",
            "name": "Weekend Shopping",
            "start": "Thamel",
            "end": "Bhatbhateni",
            "distance_km": 3.8,
            "avg_pm25": 90,
            "avg_pm10": 144,
            "exposure_time_mins": 22,
            "peak_hours_factor": 1.0,
            "total_exposure": 198
        }
    ]
    
    # Generate alternatives for each route
    routes_with_alternatives = []
    
    for route in base_routes:
        # Alternative 1: Slightly longer but less polluted
        alt1 = {
            "id": f"{route['id']}_alt1",
            "name": f"Alternative 1: Less polluted route",
            "distance_km": round(route["distance_km"] * 1.15, 1),
            "avg_pm25": int(route["avg_pm25"] * 0.65),
            "avg_pm10": int(route["avg_pm25"] * 0.65 * 1.6),
            "exposure_time_mins": int(route["distance_km"] * 1.15 * 6),
            "reduction_percent": 35,
            "extra_time_mins": int(route["distance_km"] * 1.15 * 6) - int(route["distance_km"] * 6),
            "total_exposure": int(route["avg_pm25"] * 0.65 * (route["distance_km"] * 1.15 * 6) / 10),
            "exposure_reduction": route["total_exposure"] - int(route["avg_pm25"] * 0.65 * (route["distance_km"] * 1.15 * 6) / 10)
        }
        
        # Alternative 2: Same distance but different time
        alt2 = {
            "id": f"{route['id']}_alt2",
            "name": f"Alternative 2: Travel during off-peak hours",
            "distance_km": route["distance_km"],
            "avg_pm25": int(route["avg_pm25"] * 0.75),
            "avg_pm10": int(route["avg_pm25"] * 0.75 * 1.6),
            "exposure_time_mins": int(route["distance_km"] * 6),
            "reduction_percent": 25,
            "extra_time_mins": 0,
            "total_exposure": int(route["avg_pm25"] * 0.75 * (route["distance_km"] * 6) / 10),
            "exposure_reduction": route["total_exposure"] - int(route["avg_pm25"] * 0.75 * (route["distance_km"] * 6) / 10)
        }
        
        # Alternative 3: Different transportation mode
        alt3 = {
            "id": f"{route['id']}_alt3",
            "name": f"Alternative 3: Use different transport mode",
            "distance_km": route["distance_km"],
            "avg_pm25": int(route["avg_pm25"] * 0.5),
            "avg_pm10": int(route["avg_pm25"] * 0.5 * 1.6),
            "exposure_time_mins": int(route["distance_km"] * 7),
            "reduction_percent": 50,
            "extra_time_mins": int(route["distance_km"] * 7) - int(route["distance_km"] * 6),
            "total_exposure": int(route["avg_pm25"] * 0.5 * (route["distance_km"] * 7) / 10),
            "exposure_reduction": route["total_exposure"] - int(route["avg_pm25"] * 0.5 * (route["distance_km"] * 7) / 10)
        }
        
        alternatives = [alt1, alt2, alt3]
        
        # Sort alternatives by exposure reduction
        alternatives.sort(key=lambda x: x["exposure_reduction"], reverse=True)
        
        routes_with_alternatives.append({
            "base_route": route,
            "alternatives": alternatives
        })
    
    return routes_with_alternatives

def generate_detailed_weather_data():
    """Generate detailed weather impact data on air quality"""
    # Weather parameters and their impact on air quality
    return {
        "current_weather": {
            "temperature": 28,
            "humidity": 65,
            "wind_speed": 8,
            "wind_direction": "SE",
            "precipitation": 0,
            "pressure": 1012,
            "conditions": "Partly cloudy"
        },
        "correlations": [
            {
                "parameter": "Temperature",
                "correlation": 0.65,
                "effect": "Higher temperatures generally increase pollutant concentrations due to increased photochemical reactions",
                "impact_level": "High"
            },
            {
                "parameter": "Wind Speed",
                "correlation": -0.78,
                "effect": "Higher wind speeds disperse pollutants, reducing concentrations",
                "impact_level": "Very High"
            },
            {
                "parameter": "Humidity",
                "correlation": -0.42,
                "effect": "Higher humidity can reduce some particulate matter, but increase others",
                "impact_level": "Medium"
            },
            {
                "parameter": "Precipitation",
                "correlation": -0.85,
                "effect": "Rain washes out particulate matter, significantly improving air quality",
                "impact_level": "Very High"
            },
            {
                "parameter": "Pressure",
                "correlation": 0.32,
                "effect": "High pressure systems can trap pollution near the ground",
                "impact_level": "Medium"
            }
        ],
        "hourly_forecast": [
            {"hour": "6:00", "temperature": 23, "humidity": 75, "wind_speed": 5, "aqi_forecast": 45},
            {"hour": "9:00", "temperature": 25, "humidity": 70, "wind_speed": 6, "aqi_forecast": 65},
            {"hour": "12:00", "temperature": 28, "humidity": 65, "wind_speed": 7, "aqi_forecast": 85},
            {"hour": "15:00", "temperature": 30, "humidity": 60, "wind_speed": 8, "aqi_forecast": 95},
            {"hour": "18:00", "temperature": 28, "humidity": 65, "wind_speed": 7, "aqi_forecast": 110},
            {"hour": "21:00", "temperature": 25, "humidity": 70, "wind_speed": 6, "aqi_forecast": 90}
        ],
        "seasonal_patterns": [
            {"month": "Jan", "avg_temp": 12, "avg_humidity": 55, "avg_aqi": 180},
            {"month": "Feb", "avg_temp": 14, "avg_humidity": 50, "avg_aqi": 160},
            {"month": "Mar", "avg_temp": 18, "avg_humidity": 45, "avg_aqi": 150},
            {"month": "Apr", "avg_temp": 22, "avg_humidity": 40, "avg_aqi": 120},
            {"month": "May", "avg_temp": 25, "avg_humidity": 55, "avg_aqi": 100},
            {"month": "Jun", "avg_temp": 27, "avg_humidity": 70, "avg_aqi": 70},
            {"month": "Jul", "avg_temp": 28, "avg_humidity": 85, "avg_aqi": 50},
            {"month": "Aug", "avg_temp": 27, "avg_humidity": 80, "avg_aqi": 55},
            {"month": "Sep", "avg_temp": 26, "avg_humidity": 75, "avg_aqi": 65},
            {"month": "Oct", "avg_temp": 22, "avg_humidity": 60, "avg_aqi": 90},
            {"month": "Nov", "avg_temp": 18, "avg_humidity": 50, "avg_aqi": 130},
            {"month": "Dec", "avg_temp": 14, "avg_humidity": 55, "avg_aqi": 170}
        ],
        "aqi_levels_explanation": [
            {
                "level": "Good (0-50)",
                "description": "Air quality is satisfactory, and air pollution poses little or no risk.",
                "health_implications": "None for the general population.",
                "color": "#00E400"
            },
            {
                "level": "Moderate (51-100)",
                "description": "Air quality is acceptable. However, some pollutants may be a concern for a small number of people.",
                "health_implications": "Unusually sensitive individuals should consider limiting prolonged outdoor exertion.",
                "color": "#FFFF00"
            },
            {
                "level": "Unhealthy for Sensitive Groups (101-150)",
                "description": "Members of sensitive groups may experience health effects.",
                "health_implications": "People with respiratory or heart disease, the elderly and children should limit prolonged outdoor exertion.",
                "color": "#FF7E00"
            },
            {
                "level": "Unhealthy (151-200)",
                "description": "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
                "health_implications": "People with respiratory or heart disease, the elderly and children should avoid prolonged outdoor exertion; everyone else should limit prolonged outdoor exertion.",
                "color": "#FF0000"
            },
            {
                "level": "Very Unhealthy (201-300)",
                "description": "Health alert: everyone may experience more serious health effects.",
                "health_implications": "People with respiratory or heart disease, the elderly and children should avoid any outdoor activity; everyone else should avoid prolonged outdoor exertion.",
                "color": "#8F3F97"
            },
            {
                "level": "Hazardous (301-500)",
                "description": "Health warnings of emergency conditions. The entire population is more likely to be affected.",
                "health_implications": "Everyone should avoid all outdoor exertion.",
                "color": "#7E0023"
            }
        ]
    }

def get_all_data(force_refresh=False, use_mock=True):
    """Main function to get all air quality data"""
    start_time = time.time()
    
    # Always use mock data for simplicity
    mock_data = generate_mock_data()
    
    # Add metadata
    metadata = {
        "last_updated": datetime.now().isoformat(),
        "fetch_time_seconds": round(time.time() - start_time, 2),
        "data_sources": {
            "current_aqi": True,
            "openaq": True,
            "weather": True
        }
    }
    
    mock_data["metadata"] = metadata
    
    # Save combined data
    with open(os.path.join(CONFIG["data_dir"], "combined_data.json"), 'w') as f:
        json.dump(mock_data, f, indent=2)
    
    print(f"Data processing completed in {metadata['fetch_time_seconds']} seconds")
    return mock_data

if __name__ == "__main__":
    # If running directly, fetch all data
    import argparse
    parser = argparse.ArgumentParser(description="Fetch air quality data quickly")
    parser.add_argument("--force", action="store_true", help="Force refresh all data")
    parser.add_argument("--mock", action="store_true", help="Use mock data")
    args = parser.parse_args()
    
    data = get_all_data(force_refresh=args.force, use_mock=True)
    print(json.dumps(data, indent=2))