#!/usr/bin/env python3
"""
Air Quality Data Scraper for AirNow API
This script fetches air pollution data from the AirNow API, which provides
air quality information for locations across the United States.

Requirements:
- requests
- pandas

Install with: pip install requests pandas
"""

import requests
import pandas as pd
import json
from datetime import datetime
import os

def fetch_airnow_data(api_key, latitude, longitude, distance=25):
    """
    Fetch air quality data from AirNow API for a specific location.
    
    Parameters:
    - api_key (str): Your AirNow API key
    - latitude (float): Latitude of the location
    - longitude (float): Longitude of the location
    - distance (int): Distance in miles to look for monitors (default: 25)
    
    Returns:
    - DataFrame containing the air quality data
    """
    base_url = "https://www.airnowapi.org/aq/observation/latLong/current/"
    
    params = {
        "format": "application/json",
        "latitude": latitude,
        "longitude": longitude,
        "distance": distance,
        "API_KEY": api_key
    }
    
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        data = response.json()
        
        if not data:
            print(f"No data found for location: {latitude}, {longitude}")
            return None
        
        # Convert to DataFrame
        df = pd.json_normalize(data)
        return df
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

def save_data(df, location_name):
    """
    Save the air quality data to a CSV file.
    
    Parameters:
    - df (DataFrame): The data to save
    - location_name (str): Name of the location for the filename
    """
    if df is None or df.empty:
        print("No data to save.")
        return
    
    # Create data directory if it doesn't exist
    os.makedirs("air_quality_data", exist_ok=True)
    
    # Create filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"air_quality_data/airnow_{location_name}_{timestamp}.csv"
    
    # Save to CSV
    df.to_csv(filename, index=False)
    print(f"Data saved to {filename}")

def main():
    # Replace with your actual API key
    API_KEY = "YOUR_AIRNOW_API_KEY"
    
    # Example locations (latitude, longitude, name)
    locations = [
        (40.7128, -74.0060, "new_york"),
        (34.0522, -118.2437, "los_angeles"),
        (41.8781, -87.6298, "chicago")
    ]
    
    for lat, lon, name in locations:
        print(f"Fetching data for {name}...")
        df = fetch_airnow_data(API_KEY, lat, lon)
        save_data(df, name)
        print(f"Completed for {name}\n")

if __name__ == "__main__":
    main()